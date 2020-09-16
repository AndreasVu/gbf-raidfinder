import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRaidDialogComponent } from './add-raid-dialog.component';

describe('AddRaidDialogComponent', () => {
  let component: AddRaidDialogComponent;
  let fixture: ComponentFixture<AddRaidDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRaidDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRaidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
