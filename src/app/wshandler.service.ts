import { Injectable, OnDestroy } from '@angular/core';
import { RaidCode } from 'src/models/raid-code.models';
import { Subject } from 'rxjs';
import { retryWhen, tap, delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment.prod';
import { ClientMesssage, wsResponse } from '../models/ws-response.model';
import { RaidList } from '../models/raid-list.model';
import { Raid } from 'src/models/raid.model';

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
    console.log('connecting...');
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      this.socket$
        .pipe(
          retryWhen((errors) =>
            errors.pipe(
              tap((err) => {
                console.error('Got error', err);
              }),
              delay(3000)
            )
          )
        )
        .subscribe(
          (msg: ClientMesssage) => {
            switch (msg.action) {
              case 'raidCodes':
                this.updateMap(msg.raidCodes);
                this.refreshCodes();
                break;
              default:
                break;
            }
          },
          (err) => console.log(err),
          () => {
            console.log('Socket closed...');
          }
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

  followRaid(raidEN: string) {
    this.socket$.next({
      action: 'followRaids',
      raids: [raidEN],
    });
  }

  unfollowRaid(raidEN: string) {
    this.socket$.next({
      action: 'unFollowRaids',
      raids: [raidEN],
    });
  }

  // Updates the raid list map
  updateMap(raids: RaidList[]) {
    raids.forEach((raid) => {
      this.mappedRaids.set(
        raid.raidName,
        raid.codes.map((code) => {
          return { ...code, isUsed: false };
        })
      );
    });
  }

  subscribeToRaids(selectedRaids: Raid[]) {
    this.socket$.next({
      action: 'followRaids',
      raids: selectedRaids.map((raid) => raid.en),
    });
  }

  // Resends the codes to everyone
  refreshCodes() {
    this.raidSubjects.forEach((subject, raidName) => {
      const raids = this.mappedRaids.get(raidName);
      if (raids) {
        subject.next(raids);
      }
    });
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
