import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { RaidCode } from 'src/models/raid-code.models';

@Component({
  selector: 'app-raid-element',
  templateUrl: './raid-element.component.html',
  styleUrls: ['./raid-element.component.scss']
})
export class RaidElementComponent implements OnInit, OnDestroy {
  @Input() element: RaidCode;
  timeElapsed: number = 0;
  timerId: number;

  constructor() { }

  ngOnInit(): void {
    this.timerId = setInterval(() => {this.timeElapsed += 1}, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  isUsed(): string {
    if (this.element.usedCode) {
      return 'used';
    } else {
      return null;
    }
  }
}
