import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RaidFromAPI } from '../models/raid-from-api.model';
import raids from '../raid.json'
import { RaidCode } from 'src/models/raid-code.models';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { newArray } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class ApihandlerService {
  api_url = 'http://localhost:3000';
  mappedRaids = new Map<string, RaidCode[]>();

  constructor(private http: HttpClient, private logger: LoggerService) {
    let getTimerID = setInterval(() => {
      this.http.get<any[]>(this.api_url + '/get_raids').subscribe((data) => {
        this.updateMap(new Map(data));
      });
    }, 100);
  }

  updateMap(newMap: Map<string, RaidCode[]>) {
    newMap.forEach((value, key) => {
      if (this.mappedRaids.get(key) != undefined) {
        let newRaids = value;
        let raidList = this.mappedRaids.get(key);

        newRaids.reverse().forEach(newRaid => {
          let codes: string[] = [];
          raidList.forEach(oldRaid => {
            codes.push(oldRaid.ID);
          })

          if (!codes.includes(newRaid.ID)) {
            raidList.unshift(newRaid);
          }
        })
        if (raidList.length > 6) {
          raidList = raidList.slice(0, 6);
        }

        this.mappedRaids.set(key, raidList);
      } else {
        this.mappedRaids.set(key, value);
      }
    });
  }

  // Creates a new Observable for the selected raid.
  getSelectedRaid(raidEN: string): Observable<RaidCode[]> {
    return new Observable<RaidCode[]>(observer => {
      let timerID = setInterval(() => {
        observer.next(this.mappedRaids.get(raidEN));
      }, 100);

      return {
        unsubscribe() {
          clearInterval(timerID);
        }
      }
    });
  }
}
