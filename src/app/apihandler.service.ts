import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RaidFromAPI } from '../models/raid-from-api.model';

@Injectable({
  providedIn: 'root'
})
export class ApihandlerService {
  api_url = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    let timerID = setInterval(() => this.getAndSortTweets(), 500);
  }

  getAndSortTweets() {
    try {
      this.http.get<RaidFromAPI[]>(this.api_url+'/get_raids').toPromise().then(
        (res) => {
          console.log(res);
        }
      ).error(error => )
    } catch (error) {
      console.error(error);
    }
    
  }
}
