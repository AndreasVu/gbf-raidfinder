import { Component } from '@angular/core';
import { AddRaidEntry } from 'src/models/add-raid-entry.model';
import { RaidCode } from 'src/models/raid-code.models';
import { Raid } from '../models/raid.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedRaids: Raid[] = this.getRaidsFromLocalStorage();
  title = 'raidfinder';

  constructor() {

  }

  getRaidsFromLocalStorage(): Raid[] {
    let store = localStorage.getItem('selectedRaids');
    if (store) {
      return JSON.parse(store) as Raid[];
    } else return [];
  }

  onRaidAdded(addedRaid: AddRaidEntry) {
    let raidAdd = new Raid(addedRaid.en, addedRaid.jp);
    if (!this.selectedRaids.includes(raidAdd)) {
      this.selectedRaids.push(raidAdd);

      localStorage.setItem('selectedRaids', JSON.stringify(this.selectedRaids));
    }
  }

  onRaidRemoved(raidToRemove: Raid) {
    this.selectedRaids = this.selectedRaids.filter(obj => obj !== raidToRemove);
    let oldArray = JSON.parse(localStorage.getItem('selectedRaids'));
    let oldCode = oldArray.filter((raid: Raid) => raid.en == raidToRemove.en);
    let index: number;

    if (oldCode.length) {
      index = oldArray.indexOf(oldCode[0]);

      if (index > -1) {
        oldArray.splice(index, 1);
        localStorage.setItem('selectedRaids', JSON.stringify(oldArray));
      }
    }    
  }
}
