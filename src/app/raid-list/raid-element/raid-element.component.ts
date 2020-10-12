import { Component, OnInit, Input } from '@angular/core';
import { RaidCode } from 'src/models/raid-code.models';

@Component({
  selector: 'app-raid-element',
  templateUrl: './raid-element.component.html',
  styleUrls: ['./raid-element.component.scss']
})
export class RaidElementComponent implements OnInit {
  @Input() element: RaidCode;
  timeElapsed: number = 0;

  constructor() { }

  ngOnInit(): void {
    let timerID = setInterval(() => {this.timeElapsed += 1}, 1000);
  }

  ngOnDestroy(): void {
  }
}
