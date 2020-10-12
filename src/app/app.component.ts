import { Component } from '@angular/core';
import { AddRaidEntry } from 'src/models/add-raid-entry.model';
import { Raid } from '../models/raid.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedRaids: Raid[] = [];
  title = 'raidfinder';

  onRaidAdded(raid: AddRaidEntry) {
    if (!this.selectedRaids.includes(raid)) {
      this.selectedRaids.push(raid as Raid);
    }
  }

  onRaidRemoved(raid: Raid) {
    this.selectedRaids = this.selectedRaids.filter(obj => obj !== raid);
  }
}
