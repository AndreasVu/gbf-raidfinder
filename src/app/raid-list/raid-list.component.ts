import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Raid } from 'src/models/raid.model';
import { RaidCode } from '../../models/raid-code.models';
import { WsHandlerService } from '../wshandler.service';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.scss'],
})
export class RaidListComponent implements OnInit, OnDestroy {
  @Input() raid: Raid;
  @Output() raidRemoved = new EventEmitter<Raid>();
  raidCodes: RaidCode[];
  subscription: Subscription;

  constructor(
    private raidAPI: WsHandlerService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscription = this.raidAPI.getSelectedRaid(this.raid.en).subscribe(
      (newRaids) => {
        this.updateCodes(newRaids);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateCodes(newRaids: RaidCode[]) {
    if (this.raidCodes) {
      this.raidCodes = newRaids.map((newCode) => {
        const found = this.raidCodes.find((c) => c.id == newCode.id);
        if (found) {
          return found;
        }

        return newCode;
      });
    } else {
      this.raidCodes = newRaids;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onRemoved() {
    this.raidRemoved.emit(this.raid);
  }

  onCopyCode() {
    if (this.raidCodes != null) {
      for (let i = 0; i < this.raidCodes.length; i++) {
        let code = this.raidCodes[i];
        if (!code.isUsed) {
          this.clipboard.copy(code.id);
          code.isUsed = true;
          this.showSnackbar(code.id);

          break;
        }
      }
    }
  }

  showSnackbar(id: string) {
    this.snackbar.open('Copied code: ' + id, 'Dismiss', { duration: 1000 });
  }
}
