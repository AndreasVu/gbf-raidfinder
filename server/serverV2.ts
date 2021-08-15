import express from 'express';
import http from 'http';
import untypedRaids from './raid.json';
import WebSocket from 'ws';
import TwitterStreamer from './twitterStreamer';
import { RaidCode, TwitterRaid, Raid } from './types/raidTypes';
import NodeCache from 'node-cache';
import { ClientMesssage } from './types/clientMessageType';

const app = express();
const server = http.createServer(app);
const raids: Raid[] = untypedRaids;
const twitterStreamer = new TwitterStreamer(getKeywordString());
const websocketServer = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000;

app.use(require('cors')());
app.use(require('body-parser').json());

const raidNameCache = new NodeCache();
const raidMap = new Map<string, RaidCode[]>();
const raidIdsCache = new NodeCache({ stdTTL: 250 });
const clientsRaids = new Map<WebSocket, string[]>();

twitterStreamer.onTweet((raid) => {
  if (isNew(raid.id)) {
    addRaid(raid);
    publishRaidCodes(raid.raidName);
  }
});

server.listen(PORT, () => {
  console.log(`Websocket server running on port ${PORT}`);
});

websocketServer.on('connection', handleConnection);

function getKeywordString() {
  let keywords = '';
  for (let i = 0; i < raids.length; i++) {
    keywords += raids[i].en + ',' + raids[i].jp;
    if (i != raids.length - 1) {
      keywords += ',';
    }
  }

  return keywords;
}

// Gets the english name for the raid.
function getEnglishRaidName(raidName: string): string | undefined {
  let englishRaidName: string | undefined = raidNameCache.get(raidName);
  if (englishRaidName == undefined) {
    englishRaidName = raids.find(
      (raid) => raid.en === raidName || raid.jp === raidName
    )?.en;
    raidNameCache.set(raidName, englishRaidName);
  }

  return englishRaidName;
}

// Checks if raid is in raid id cache. To not get duplicate codes
function isNew(raidId: string): boolean {
  let exists: boolean | undefined = raidIdsCache.get(raidId);
  if (exists == undefined) {
    raidIdsCache.set(raidId, false);
  }

  return exists ?? true;
}

// Add raid to map
function addRaid(raid: TwitterRaid): void {
  var englishName = getEnglishRaidName(raid.raidName);
  if (englishName == undefined) return;

  let raidCode = { createdAt: raid.createdAt, id: raid.id };
  let raidCodes = raidMap.get(englishName);
  if (raidCodes) {
    if (raidCodes.length >= 6) {
      raidCodes = raidCodes.slice(0, 5);
    }

    raidCodes.unshift(raidCode);
    raidMap.set(englishName, raidCodes);
  } else {
    raidMap.set(englishName, [raidCode]);
  }
}

function handleConnection(ws: WebSocket, req: http.IncomingMessage) {
  ws.send('{"action": "welcomeMessage", "message": "OK"}');
  ws.on('message', (message) => handleClientMessage(message, ws));
  ws.on('close', disconnectClient);
}

function handleClientMessage(data: WebSocket.Data, ws: WebSocket) {
  const message: ClientMesssage = JSON.parse(data.toString());
  switch (message.action) {
    case 'followRaids':
      addRaidsToClient(ws, message.raids);
      break;
    case 'unFollowRaids':
      removeRaidsFromClient(ws, message.raids);
      break;
  }
}

function disconnectClient(ws: WebSocket) {
  clientsRaids.delete(ws);
}

function addRaidsToClient(ws: WebSocket, raids: string[]) {
  if (!raids.every((raid) => isValidRaidName(raid))) return;

  const clientRaids = clientsRaids.get(ws) ?? [];
  for (const raid of raids) {
    if (!clientRaids.includes(raid)) {
      clientRaids.push(raid);
      publishRaidCodes(raid);
    }
  }

  clientsRaids.set(ws, clientRaids);
}

function removeRaidsFromClient(ws: WebSocket, raids: string[]) {
  if (!raids.every((raid) => isValidRaidName(raid))) return;

  const clientRaids = clientsRaids.get(ws) ?? [];
  clientsRaids.set(
    ws,
    clientRaids.filter((raid) => !raids.includes(raid))
  );
}

const isValidRaidName = (raidName: string) =>
  raids.some((raid) => raid.en === raidName || raid.jp === raidName);

function publishRaidCodes(raidName: string) {
  const englishName = getEnglishRaidName(raidName);
  if (englishName == undefined) return;

  clientsRaids.forEach((raids, ws) => {
    if (!raids.includes(englishName)) return;
    const raidCodes = getRaidCodes(raids);
    ws.send(
      JSON.stringify({
        action: 'raidCodes',
        raidCodes,
      })
    );
  });
}

function getRaidCodes(clientRaids: string[]) {
  return clientRaids.map((raid) => {
    const codes = raidMap.get(raid) ?? [];
    return { raidName: raid, codes: codes };
  });
}
