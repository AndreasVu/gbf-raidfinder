const express = require('express');
const Twitter = require('twit');
const settings = require('./settings.json');
const raids = require('./raid.json');
const app = express();
const api_client = new Twitter(settings);

app.use(require('cors')());
app.use(require('body-parser').json());

let raid_buffer = [];
let all_codes = [];
let timerID = setInterval(() => all_codes = [], 60000);
// Creates a new streaming instance
let stream = api_client.stream('statuses/filter', {track: get_keyword_string()});


// Adds tweets found to buffer if it is valid
stream.on('tweet', function (tweet) {
    if (isValid(tweet)) {
        raid_buffer.push(new_raid_code(tweet));
        if (raid_buffer.length > 1500) {
            raid_buffer =  raid_buffer.slice(1000, raid_buffer.length);
        }
    }
});

// Finds the raid ID from the tweet text
function get_raid_id(text) {
    let res = null;
    try {
        res = text.substr(text.indexOf(":") - 9, 8 );
    } catch (error) {
        console.error(error);
    }
    
    return res;
};

// Finds the name of the raid from the tweet text
function get_raid_name(text) {
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
function new_raid_code(tweet) {
    let tweet_text = tweet.text
    return {
        ID: get_raid_id(tweet_text), 
        raidName: get_raid_name(tweet_text),
        time: tweet.created_at
    }
}


function isExisting(id) {
    if (all_codes.includes(id)) {
      return true
    } else {
      all_codes.push(id);
      return false;
    }
}

// chekcs if the tweet is valid
function isValid(tweet) {
    if ( tweet.source !== '<a href="http://granbluefantasy.jp/" rel="nofollow">グランブルー ファンタジー</a>' ) {
        return false;
    } else {
        let tweet_id = get_raid_id(tweet.text);
        if (!isExisting(tweet_id)) {
            return true;
        } 
    }
}

// Adds every raid from the raidlist to the twitter stream filter.
function get_keyword_string() {
    let keywords = "";
    for (let i = 0; i < raids.length; i++) {
        keywords += raids[i].en + "," + raids[i].jp;
        if (i != raids.length - 1) {
            keywords += ',';
        }
    }
    
    return keywords;
}

// Endpoint used to get all the raids
// Resets the buffer after use
app.get("/get_raids", (req, res) => {
    res.send(raid_buffer);
    raid_buffer = [];
});

app.listen(3000, () => console.log('Server running'));
