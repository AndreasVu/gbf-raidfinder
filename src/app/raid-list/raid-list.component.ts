import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Raid } from 'src/models/raid.model';
import { RaidCode } from '../../models/raid-code.models';
import { ApihandlerService } from '../apihandler.service';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.scss']
})
export class RaidListComponent implements OnInit, OnDestroy {
  @Input() raid: Raid;
  @Output() raidRemoved = new EventEmitter<Raid>();
  raidCodes: Observable<RaidCode[]>;
  raidIdCodes: Array<RaidCode>;
  timerID: number;

  constructor(private raidAPI: ApihandlerService) { }

  ngOnInit(): void {
    this.timerID = setInterval(() => {
      this.raidCodes = this.raidAPI.getSelectedRaid(this.raid.en);
      this.raidCodes.subscribe(value => this.raidIdCodes = value);
    }, 50)
  }

  ngOnDestroy(): void {
    clearInterval(this.timerID);
  }

  onRemoved() {
    this.raidRemoved.emit(this.raid);
  }

  onCopyCode() {
    if (this.raidIdCodes[0] !=  null) {
      return this.raidIdCodes[0].ID;
    } else {
      return null;
    }
  }

}
