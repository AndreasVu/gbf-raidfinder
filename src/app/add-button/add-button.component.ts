import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AddRaidDialogComponent } from './add-raid-dialog/add-raid-dialog.component';
import { AddRaidEntry } from '../../models/add-raid-entry.model'
import categories from '../../categories.json'

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {
  @Output() raidSelected = new EventEmitter<AddRaidEntry>();
  categories = categories;
  dialogRef: MatDialogRef<AddRaidDialogComponent, any>;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  openRaidList() {
    if (this.dialogRef == null) {
      this.dialogRef = this.dialog.open(AddRaidDialogComponent, {
        width: '50em'
      });
    }

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.raidSelected.emit(result);
      }
      this.dialogRef = null;
    });

    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key == 'ESC') {
        this.dialogRef.close();
      }
    });
  }
}
