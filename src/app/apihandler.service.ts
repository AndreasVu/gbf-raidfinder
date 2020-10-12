import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RaidFromAPI } from '../models/raid-from-api.model';
import categories from '../categories.json'
import raids from '../raid.json'
import { RaidCode } from 'src/models/raid-code.models';

@Injectable({
  providedIn: 'root'
})
export class ApihandlerService {
  api_url = 'http://localhost:3000';
  mappedRaids = new Map<string, RaidCode[]>();

  constructor(private http: HttpClient) {
    let timerID = setInterval(() => this.getAndSortTweets(), 500);
  }

  getAndSortTweets() {
    try {
      this.http.get<RaidFromAPI[]>('http://localhost:3000/get_raids').toPromise().then(
        (newRaids) => {
          newRaids.forEach(newRaid => {
            raids.forEach(raid => {
              if (newRaid.raidName == raid.en) {
                if (this.mappedRaids.get(raid.en) == null) {
                  this.mappedRaids.set(raid.en, [new RaidCode(
                    newRaid.time,
                    newRaid.ID,
                    false
                  )]);
                } else {
                  let prevArray = this.mappedRaids.get(raid.en);
                  if (prevArray.length > 6) {
                    prevArray.pop();
                  }
                  prevArray.unshift(new RaidCode(
                    newRaid.time,
                    newRaid.ID,
                    false
                  ));
                  this.mappedRaids.set(raid.en, prevArray);
                }
              }
            }) 
          })
        }
      ).catch((error) => {

      })
    } catch (error) {
    }
  }

  getSelectedRaid(raidEN: string) {
    return this.mappedRaids.get(raidEN);
  }
}
