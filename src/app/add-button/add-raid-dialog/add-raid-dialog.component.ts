import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddRaidEntry } from '../../../models/add-raid-entry.model'
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import raids from '../../../raid.json'
import categories from '../../../categories.json'

@Component({
  selector: 'app-add-raid-dialog',
  templateUrl: './add-raid-dialog.component.html',
  styleUrls: ['./add-raid-dialog.component.scss']
})
export class AddRaidDialogComponent implements OnInit {
  @ViewChild('search', {static: false}) inputEl:ElementRef;
  raids = raids as AddRaidEntry[];
  categories = categories;
  raidMap = new Map;
  searchedRaidsList: AddRaidEntry[] = [];
  searchUpdate = new Subject<string>();

  constructor() { }

  ngOnInit(): void {
    this.categories.forEach((category) => {
      let categoryRaids = this.raids.filter((raid) => {
        return raid.category == category;
      });
      this.raidMap.set(category, categoryRaids)
    });

    setTimeout(() => this.inputEl.nativeElement.focus());

    this.searchUpdate.pipe(
      debounceTime(200),
      distinctUntilChanged()).subscribe(searchTerm => {
        if (searchTerm != "") {
          this.searchedRaidsList = this.raids.filter((raid) => raid.en.toLowerCase().includes(searchTerm.toLowerCase()));
        } else {
          this.searchedRaidsList = [];
        }
      })
  }
}
