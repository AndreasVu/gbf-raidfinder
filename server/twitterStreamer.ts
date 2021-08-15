import Twitter from 'twit';
import { Tweet } from './types/tweetType';
import { TwitterRaid } from './types/raidTypes';
const keys = {
  consumer_key: process.env.consumer_key ?? '',
  consumer_secret: process.env.consumer_secret ?? '',
  access_token: process.env.access_token ?? '',
  access_token_secret: process.env.access_token_secret ?? '',
};

export default class TwitterStreamer {
  apiClient: Twitter;
  stream: Twitter.Stream;

  constructor(keywordString: string) {
    this.apiClient = new Twitter(keys);
    this.stream = this.apiClient.stream('statuses/filter', {
      track: keywordString,
    });
  }

  onTweet(callback: (raid: TwitterRaid) => any) {
    this.stream.on('tweet', (tweet: Tweet) => {
      try {
        if (this.isValid(tweet)) {
          let raid = this.getRaid(tweet);
          callback(raid);
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  private isValid(tweet: Tweet): boolean {
    if (
      tweet.source !==
      '<a href="http://granbluefantasy.jp/" rel="nofollow">グランブルー ファンタジー</a>'
    ) {
      return false;
    }

    return true;
  }

  private getRaid(tweet: Tweet): TwitterRaid {
    let id = this.getRaidId(tweet.text);
    let raidName = this.getRaidName(tweet.text);
    return { createdAt: tweet.created_at, id, raidName };
  }

  private getRaidId(tweetText: string): string {
    let res;
    try {
      res = tweetText.substr(tweetText.indexOf(':') - 9, 8);
    } catch (error) {
      console.error(error);
    }

    return res ?? '';
  }

  private getRaidName(tweetText: string): string {
    let res;
    try {
      var splitted = tweetText.split('\n');
      res = splitted[splitted.length - 2];
    } catch (error) {
      console.error(error);
    }

    return res ?? '';
  }
}
