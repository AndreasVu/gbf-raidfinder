import { Component } from '@angular/core';
import { Raid } from '../models/raid.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedRaids: Raid[] = [
    new Raid('Lucilius', 123123),
    new Raid('Lucilius', 123123),
    new Raid('Lucilius', 123123),
  ];
  title = 'raidfinder';
}
