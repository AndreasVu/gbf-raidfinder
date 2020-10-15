import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { Raid } from 'src/models/raid.model';
import { RaidCode } from '../../models/raid-code.models';
import { ApihandlerService } from '../apihandler.service';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.scss']
})
export class RaidListComponent implements OnInit, OnDestroy {
  @Input() raid: Raid;
  @Output() raidRemoved = new EventEmitter<Raid>();
  raidCodes: RaidCode[];
  subscription: Subscription;

  constructor(
    private raidAPI: ApihandlerService, 
    private logger: LoggerService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subscription = this.raidAPI.getSelectedRaid(this.raid.en).subscribe(
      (newRaids) => {
      this.raidCodes = newRaids;
    }, (error) => {
      this.logger.error(error);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRemoved() {
    this.raidRemoved.emit(this.raid);
  }

  onCopyCode() {
    if (this.raidCodes !=  null) {
      for (let i = 0; i < this.raidCodes.length; i++) {
        let code = this.raidCodes[i];
        if (!code.isUsed) {
          this.clipboard.copy(code.ID);
          code.isUsed = true;
          this.showSnackbar(code.ID);
          
          break;
        }
      }
    }
  }

  showSnackbar(id: string) {
    this.snackbar.open('Copied code: ' + id, 'Dismiss', {duration: 1000});
  }
}
