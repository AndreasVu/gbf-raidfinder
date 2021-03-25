import { Injectable, OnDestroy } from '@angular/core';
import { RaidCode } from 'src/models/raid-code.models';
import { Subject } from 'rxjs';
import { retryWhen, tap, delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment.prod';
import { wsResponse } from '../models/ws-response.model';
import { RaidList } from '../models/raid-list.model';

@Injectable({
  providedIn: 'root',
})
export class WsHandlerService implements OnDestroy {
  private WS_ENPOINT = environment.wsEndpoint;
  private mappedRaids = new Map<string, RaidCode[]>();
  private socket$: WebSocketSubject<any>;
  private raidSubjects = new Map<string, Subject<RaidCode[]>>();

  private getNewWebSocket() {
    return webSocket(this.WS_ENPOINT);
  }

  public connect(): void {
    console.log("connecting...");
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      this.socket$.pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(err => {
              console.error('Got error', err);
            }),
            delay(3000)
          )
        )
      ).subscribe(
        (msg: wsResponse) => {
          if (msg.message) {
            this.updateMap(msg.message);
            this.refreshCodes();
          }
        },
        (err) => console.log(err),
        () => { console.log("Socket closed...");}
      );
    }
  }

  // Returns an observable with the selcted raid
  getSelectedRaid(raidEN: string): Subject<RaidCode[]> {
    const sub = this.raidSubjects.get(raidEN);
    if (sub) {
      return sub;
    }

    let newSub = new Subject<RaidCode[]>();
    this.raidSubjects.set(raidEN, newSub);

    return newSub;
  }

  // Updates the raid list map
  updateMap(raids: RaidList[]) {
    raids.forEach((raid) => {
      raid = new RaidList(raid[0], raid[1]);
  
      let codes = raid.codes.map((raidCode) => {
        return new RaidCode(raidCode.time, raidCode.ID, false);
      });

      this.mappedRaids.set(raid.raidName, codes);
    });
  }

  // Resends the codes to everyone
  refreshCodes() {
    this.raidSubjects.forEach((subject, raidName) => {
      const raids = this.mappedRaids.get(raidName);
      if (raids) {
        subject.next(raids)
      }
    })
  }

  // Closes the connection
  closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }

  ngOnDestroy() {
    this.closeConnection();
  }
}
