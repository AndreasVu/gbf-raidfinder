import { Component, OnInit } from '@angular/core';
import { AddRaidEntry } from 'src/models/add-raid-entry.model';
import { RaidCode } from 'src/models/raid-code.models';
import { Raid } from '../models/raid.model';
import { WsHandlerService } from './wshandler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedRaids: Raid[] = [];
  title = 'raidfinder';

  constructor(private readonly service: WsHandlerService) {}

  ngOnInit() {
    this.selectedRaids = this.getRaidsFromLocalStorage();
    this.service.connect();
    this.service.subscribeToRaids(this.selectedRaids);
  }

  getRaidsFromLocalStorage(): Raid[] {
    let store = localStorage.getItem('selectedRaids');
    if (store) {
      return JSON.parse(store) as Raid[];
    } else return [];
  }

  onRaidAdded(addedRaid: AddRaidEntry) {
    let raidAdd = { en: addedRaid.en, jp: addedRaid.jp };
    let filteredRaidList = this.selectedRaids.filter(
      (raid) => raid.en == raidAdd.en
    );

    if (!filteredRaidList.length) {
      this.service.followRaid(raidAdd.en);
      this.selectedRaids.push(raidAdd);
      localStorage.setItem('selectedRaids', JSON.stringify(this.selectedRaids));
    }
  }

  onRaidRemoved(raidToRemove: Raid) {
    this.selectedRaids = this.selectedRaids.filter(
      (raid) => raid.en != raidToRemove.en
    );
    this.service.unfollowRaid(raidToRemove.en);
    localStorage.setItem('selectedRaids', JSON.stringify(this.selectedRaids));
  }
}
