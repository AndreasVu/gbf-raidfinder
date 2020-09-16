import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddRaidDialogComponent } from './add-raid-dialog/add-raid-dialog.component';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    
  }

  openRaidList() {
    this.dialog.open(AddRaidDialogComponent, {
      height: '400px',
      width: '600px',
    });
  }
}
