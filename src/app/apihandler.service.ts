import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RaidFromAPI } from '../models/raid-from-api.model';
import raids from '../raid.json'
import { RaidCode } from 'src/models/raid-code.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApihandlerService {
  api_url = 'http://localhost:3000/get_raids';
  mappedRaids = new Map<string, RaidCode[]>();

  constructor(private http: HttpClient) {
    let getTimerID = setInterval(() => this.getAndSortTweets(), 100);
  }

  addToMap(raid: RaidFromAPI, raidNameEN: string) {
    let raidMap = this.mappedRaids.get(raidNameEN);
    let newRaidCode = new RaidCode(raid.time, raid.ID, false);

    if (raidMap != null) {
      if (raidMap.length >= 6) {
        raidMap = raidMap.slice(0, 5);
      } 
      raidMap.unshift(newRaidCode);
      this.mappedRaids.set(raidNameEN, raidMap);
    } else {
      this.mappedRaids.set(raidNameEN, [newRaidCode]);
    }
  }

  sortRaid(raidToBeSorted: RaidFromAPI) {
    raids.forEach(raid => {
      if (raid.jp == raidToBeSorted.raidName || raid.en == raidToBeSorted.raidName) {
        this.addToMap(raidToBeSorted, raid.en);
      }
    })
  }

  getAndSortTweets() {
    try {
      this.http.get<RaidFromAPI[]>(this.api_url).subscribe(
        (newRaids) => {
          this.sortSubscriber(newRaids);
        });
    } catch {

    }
  }

  sortSubscriber(newRaids: RaidFromAPI[]) {
    newRaids.forEach(raid => {
      this.sortRaid(raid)
    })
  }

  getSelectedRaid(raidEN: string): Observable<RaidCode[]> {
    return new Observable<RaidCode[]>(observer => {
      observer.next(this.mappedRaids.get(raidEN));
    });
  }
}
