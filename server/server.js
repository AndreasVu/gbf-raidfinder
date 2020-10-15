const express = require('express');
const Twitter = require('twit');
const settings = require('./settings.json');
const raids = require('./raid.json');
const app = express();
const fs = require('fs');
const apiClient = new Twitter(settings);

app.use(require('cors')());
app.use(require('body-parser').json());

let raidBuffer = [];
let allCodes = [];
let timerID = setInterval(() => allCodes = [], 60000);
let mappedRaids = new Map();
// Creates a new streaming instance
let stream = apiClient.stream('statuses/filter', {track: getKeywordString()});


// Adds tweets found to buffer if it is valid
stream.on('tweet', (tweet) => {
    if (isValid(tweet)) {
        raidBuffer.push(createNewRaidCode(tweet));
        sortRaid(createNewRaidCode(tweet));
    }
});

function sortRaid(raidToBeSorted) {
    raids.forEach(raid => {
        if (raid.jp == raidToBeSorted.raidName || raid.en == raidToBeSorted.raidName) {
          addToMap(raidToBeSorted, raid.en);
        }
      })
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
        res = text.substr(text.indexOf(":") - 9, 8 );
    } catch (error) {
        console.error(error);
    }
    
    return res;
};

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
};

// Creates a JSON object with:
// * ID: The ID used to join the raid
// * raidName: the name of the raid
// * time: the date and time for when the tweet was postet
function createNewRaidCode(tweet) {
    let tweetText = tweet.text
    return {
        ID: getRaidId(tweetText), 
        raidName: getRaidName(tweetText),
        time: tweet.created_at
    }
}

// Checks if the code has already been added
function isExisting(id) {
    if (allCodes.includes(id)) {
      return true
    } else {
      allCodes.push(id);
      return false;
    }
}

// chekcs if the tweet is valid and if the code has been added before
function isValid(tweet) {
    if ( tweet.source !== '<a href="http://granbluefantasy.jp/" rel="nofollow">グランブルー ファンタジー</a>' ) {
        return false;
    } else {
        let tweetId = getRaidId(tweet.text);
        if (!isExisting(tweetId)) {
            return true;
        } 
    }
}

// Adds every raid from the raidlist to the twitter stream filter.
function getKeywordString() {
    let keywords = "";
    for (let i = 0; i < raids.length; i++) {
        keywords += raids[i].en + "," + raids[i].jp;
        if (i != raids.length - 1) {
            keywords += ',';
        }
    }
    
    return keywords;
}

function logToFile(message) {
    fs.appendFile('log.txt', message.message, (error) => {
        if (error) {
            console.log('Could not log to file. Error: ' + error);
            return false;
        }
    });

    console.log(message);

    return true;
}

// Endpoint used to get all the raids
// Resets the buffer after use
app.get("/get_raids", (req, res) => {
    jsonString = JSON.stringify([...mappedRaids]);
    res.send(jsonString);
});

app.post("/log", (req, res) => {
    if (logToFile(req.body)) {
        res.send({'message': 'OK'});
    }
});

app.listen(3000, () => console.log('Server running'));
