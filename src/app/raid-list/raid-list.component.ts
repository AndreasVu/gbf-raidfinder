import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Raid } from 'src/models/raid.model';
import { RaidCode } from '../../models/raid-code.models';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.scss']
})
export class RaidListComponent implements OnInit {
  @Input() raid: Raid;
  @Output() raidRemoved = new EventEmitter<Raid>();
  raidCodes: RaidCode[] = [{time: 0, ID: '123123', used: false}];

  constructor() { }

  ngOnInit(): void {
  }

  onRemoved() {
    this.raidRemoved.emit(this.raid);
  }

  onCopyCode() {
    this.raidCodes.forEach(raid => {
      if (!raid.used) {
        raid.used = true;
        return raid;
      }
    })
  }

}
