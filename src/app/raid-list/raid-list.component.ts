import { Component, OnInit } from '@angular/core';
import { RaidCode } from '../../models/raid-code.models';

@Component({
  selector: 'app-raid-list',
  templateUrl: './raid-list.component.html',
  styleUrls: ['./raid-list.component.scss']
})
export class RaidListComponent implements OnInit {
  raidCodes: RaidCode[];

  constructor() { }

  ngOnInit(): void {
  }

}
