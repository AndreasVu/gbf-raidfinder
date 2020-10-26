import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AddRaidDialogComponent } from './add-raid-dialog/add-raid-dialog.component';
import { AddRaidEntry } from '../../models/add-raid-entry.model'

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {
  @Output() raidSelected = new EventEmitter<AddRaidEntry>();
  dialogRef: MatDialogRef<AddRaidDialogComponent, any>

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRaidList() {
    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(AddRaidDialogComponent, {
        width: '600px',
      });
  
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.raidSelected.emit(result);
        }
        this.dialogRef = null;
      });
    }
  }
}
