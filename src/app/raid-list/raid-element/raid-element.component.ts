import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { RaidCode } from 'src/models/raid-code.models';

@Component({
  selector: 'app-raid-element',
  templateUrl: './raid-element.component.html',
  styleUrls: ['./raid-element.component.scss'],
})
export class RaidElementComponent implements OnInit, OnDestroy {
  @Input() element: RaidCode;
  timeElapsed: number;
  timerId: number;

  constructor(private clipboard: Clipboard) {}

  ngOnInit(): void {
    let tweetTime = new Date(this.element.createdAt);
    this.timeElapsed = Math.floor(
      (new Date().getTime() - tweetTime.getTime()) / 1000
    );
    this.timerId = setInterval(() => {
      this.timeElapsed = Math.floor(
        (new Date().getTime() - tweetTime.getTime()) / 1000
      );
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  onClick() {
    this.clipboard.copy(this.element.id);
    this.element.isUsed = true;
  }
}
