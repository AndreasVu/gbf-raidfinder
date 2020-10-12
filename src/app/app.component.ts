import { Component } from '@angular/core';
import { AddRaidEntry } from 'src/models/add-raid-entry.model';
import { Raid } from '../models/raid.model'
import { ApihandlerService } from './apihandler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedRaids: Raid[] = [];
  title = 'raidfinder';

  constructor(api: ApihandlerService) {

  }

  onRaidAdded(raid: AddRaidEntry) {
    if (!this.selectedRaids.includes(raid)) {
      this.selectedRaids.push(raid as Raid);
    }
  }

  onRaidRemoved(raid: Raid) {
    this.selectedRaids = this.selectedRaids.filter(obj => obj !== raid);
  }
}
