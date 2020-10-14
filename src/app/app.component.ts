import { Component } from '@angular/core';
import { AddRaidEntry } from 'src/models/add-raid-entry.model';
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
      return JSON.parse(store);
    } else return [];
  }

  onRaidAdded(raid: AddRaidEntry) {
    if (!this.selectedRaids.includes(raid)) {
      this.selectedRaids.push(raid as Raid);

      localStorage.setItem('selectedRaids', JSON.stringify(this.selectedRaids));
    }
  }

  onRaidRemoved(raid: Raid) {
    this.selectedRaids = this.selectedRaids.filter(obj => obj !== raid);
    let oldArray = JSON.parse(localStorage.getItem('selectedRaids')) as Raid[];
    localStorage.setItem('selectedRaids', JSON.stringify(
      oldArray.filter(element => {
        element != raid
      })
    ));
  }
}
