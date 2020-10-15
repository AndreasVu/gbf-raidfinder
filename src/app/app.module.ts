import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddButtonComponent } from './add-button/add-button.component';
import { AddRaidDialogComponent } from './add-button/add-raid-dialog/add-raid-dialog.component';
import { AppComponent } from './app.component';
import { RaidElementComponent } from './raid-list/raid-element/raid-element.component';
import { RaidListComponent } from './raid-list/raid-list.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    AppComponent,
    AddButtonComponent,
    RaidListComponent,
    RaidElementComponent,
    AddRaidDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatRippleModule,
    ClipboardModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  entryComponents: [
    RaidListComponent
  ],
  providers: [{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
