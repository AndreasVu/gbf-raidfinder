const express = require("express");
const http = require("http");
const Twitter = require("twit");
const raids = require("./raid.json");
const app = express();
const server = http.createServer(app);
const WebSocket = require("ws");
const websocketServer = new WebSocket.Server({ server });
const keys = {
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
};
const apiClient = new Twitter(keys);
const PORT = process.env.PORT || 5000;

app.use(require("cors")());
app.use(require("body-parser").json());

let raidBuffer = [];
let allCodes = [];
let timerID = setInterval(() => (allCodes = []), 60000);
let mappedRaids = new Map();
// Creates a new streaming instance
let stream = apiClient.stream("statuses/filter", { track: getKeywordString() });

// Adds tweets found to buffer if it is valid
stream.on("tweet", (tweet) => {
  try {
    if (isValid(tweet)) {
      raidBuffer.push(createNewRaidCode(tweet));
      sortRaid(createNewRaidCode(tweet));
      emittRaids();
    }
  } catch (e) {
    console.log(e);
  }
});

async function sortRaid(raidToBeSorted) {
  raids.forEach((raid) => {
    if (
      raid.jp == raidToBeSorted.raidName ||
      raid.en == raidToBeSorted.raidName
    ) {
      addToMap(raidToBeSorted, raid.en);
    }
  });
}

// Adds the raid to the map
function addToMap(raidToBeAdded, raidNameEN) {
  let raidMap = mappedRaids.get(raidNameEN);

  if (raidMap != null) {
    if (raidMap.length >= 6) {
      raidMap = raidMap.slice(0, 5);
    }
    raidMap.unshift(raidToBeAdded);
    mappedRaids.set(raidNameEN, raidMap);
  } else {
    mappedRaids.set(raidNameEN, [raidToBeAdded]);
  }
}

// Finds the raid ID from the tweet text
function getRaidId(text) {
  let res = null;
  try {
    res = text.substr(text.indexOf(":") - 9, 8);
  } catch (error) {
    console.error(error);
  }

  return res;
}

// Finds the name of the raid from the tweet text
function getRaidName(text) {
  let res = null;
  try {
    var splitted = text.split("\n");
    res = splitted[splitted.length - 2];
  } catch (error) {
    console.error(error);
  }

  return res;
}

// Creates a JSON object with:
// * ID: The ID used to join the raid
// * raidName: the name of the raid
// * time: the date and time for when the tweet was postet
function createNewRaidCode(tweet) {
  let tweetText = tweet.text;
  return {
    ID: getRaidId(tweetText),
    raidName: getRaidName(tweetText),
    time: tweet.created_at,
  };
}

// Checks if the code has already been added
function codeExists(id) {
  if (allCodes.includes(id)) {
    return true;
  } else {
    allCodes.push(id);
    return false;
  }
}

// checks if the tweet is valid and if the code has been added before
function isValid(tweet) {
  if (
    tweet.source !==
    '<a href="http://granbluefantasy.jp/" rel="nofollow">グランブルー ファンタジー</a>'
  ) {
    return false;
  }

  let tweetId = getRaidId(tweet.text);
  if (!codeExists(tweetId)) {
    return true;
  }

  return false;
}

// Adds every raid from the raidlist to the twitter stream filter.
function getKeywordString() {
  let keywords = "";
  for (let i = 0; i < raids.length; i++) {
    keywords += raids[i].en + "," + raids[i].jp;
    if (i != raids.length - 1) {
      keywords += ",";
    }
  }

  return keywords;
}

function emittRaids() {
  websocketServer.clients.forEach((client) => {
    client.send(`{ "message": ${JSON.stringify([...mappedRaids])} }`);
  });
}

websocketServer.on("connection", (wsClient) => {
  wsClient.send('{"connection": "ok"}');
});

server.listen(PORT, () =>
  console.log(`Websocket server running on port ${PORT}`)
);
