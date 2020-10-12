import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddRaidDialogComponent } from './add-raid-dialog/add-raid-dialog.component';
import { AddRaidEntry } from '../../models/add-raid-entry.model'

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {
  @Output() raidSelected = new EventEmitter<AddRaidEntry>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRaidList() {
    let dialogRef = this.dialog.open(AddRaidDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.raidSelected.emit(result);
    });
  }
}
