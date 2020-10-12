const express = require('express');
const Twitter = require('twit');
const settings = require('./settings.json');
const app = express();
const api_client = new Twitter(settings);

var keywords = ":Battle ID, :参戦ID";
var raid_buffer = [];
var stream = api_client.stream('statuses/filter', {track: keywords});

app.use(require('cors')());
app.use(require('body-parser').json());

stream.on('tweet', function (tweet) {
    raid_buffer.push({
        ID: get_raid_id(tweet), 
        raidName: get_raid_name(tweet),
        time: tweet.created_at
    });
});

app.get("/get_raids", (req, res) => {
    res.send(raid_buffer);
    raid_buffer = [];
});

function get_raid_id(raid) {
    var text = raid.text;
    var res = null;
    try {
        res = text.substr(text.indexOf(":") - 9, 8 );
    } catch (error) {
        console.error(error);
    }
    
    return res;
};

function get_raid_name(raid) {
    var text = raid.text;
    var res = null;
    try {
        var splitted = text.split("\n");
        res = splitted[splitted.length - 2];
    } catch (error) {
        console.error(error);
    }

    return res;
};

app.listen(3000, () => console.log('Server running'));