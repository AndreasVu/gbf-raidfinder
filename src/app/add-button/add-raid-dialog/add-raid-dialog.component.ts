import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddRaidEntry } from '../../../models/add-raid-entry.model'
import raids from '../../../raid.json'
import categories from '../../../categories.json'
@Component({
  selector: 'app-add-raid-dialog',
  templateUrl: './add-raid-dialog.component.html',
  styleUrls: ['./add-raid-dialog.component.scss']
})
export class AddRaidDialogComponent implements OnInit {
  @ViewChild('search', {static: false}) inputEl:ElementRef;
  selectedRaid: AddRaidEntry;
  raids = raids as AddRaidEntry[];
  categories = categories;
  raidMap = new Map;
  searchString: string = "";
  searchedRaidsList: AddRaidEntry[] = [];

  constructor() {}

  ngOnInit(): void {
    this.categories.forEach((category) => {
      let categoryRaids = this.raids.filter((raid) => {
        return raid.category == category;
      });
      this.raidMap.set(category, categoryRaids)
    });

    setTimeout(() => this.inputEl.nativeElement.focus());
  }

  findRaids(searchTerm: string) {
    if (searchTerm != "") {
      this.searchedRaidsList = this.raids.filter((raid) => raid.en.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      this.searchedRaidsList = [];
    }
    
  }
}
