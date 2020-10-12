import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Raid } from 'src/models/raid.model';
import { RaidCode } from '../../models/raid-code.models';
import { ApihandlerService } from '../apihandler.service';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.scss']
})
export class RaidListComponent implements OnInit {
  @Input() raid: Raid;
  @Output() raidRemoved = new EventEmitter<Raid>();
  raidCodes: RaidCode[] = [];

  constructor(private raidAPI: ApihandlerService) { }

  ngOnInit(): void {
    let timerID = setInterval(() => {
      this.raidCodes = this.raidAPI.getSelectedRaid(this.raid.en);
    }, 500)
  }

  onRemoved() {
    this.raidRemoved.emit(this.raid);
  }

  onCopyCode() {
    if (this.raidCodes[0] !=  null) {
      return this.raidCodes[0].ID;
    } else {
      return null;
    }
  }

}
