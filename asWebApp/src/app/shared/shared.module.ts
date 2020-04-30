import { NgModule } from '@angular/core';
// import { NgxMdModule } from 'ngx-md';
import { MarkdownModule } from 'ngx-markdown'
import { MatCardModule, MatDialogModule, MatListModule, MatExpansionModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { TileComponent } from './tile/tile.component';
import { ReaderComponent } from './reader/reader.component';
import { TilecardComponent, MyDialog } from './tilecard/tilecard.component';
import { StudyComponent } from './study/study.component';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { StudyService } from './study.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatExpansionModule,
    MarkdownModule.forRoot()
    //NgxMdModule.forRoot()
  ],
  entryComponents: [TilecardComponent, MyDialog, MyDialogComponent],
  declarations: [FooterComponent, HeaderComponent, TileComponent, ReaderComponent, TilecardComponent, MyDialog, StudyComponent, MyDialogComponent],
  exports: [FooterComponent, HeaderComponent, TileComponent, ReaderComponent, TilecardComponent, StudyComponent, MyDialogComponent ],
  providers: [ StudyService ]
})
export class SharedModule { }
