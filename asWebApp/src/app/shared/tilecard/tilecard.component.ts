import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router }   from '@angular/router';
import { Study } from '../study/Study';
import { StudyService } from '../study.service';
/**
Another type of tile using the Material card.
*/
@Component({
  selector: 'app-tilecard',
  templateUrl: './tilecard.component.html',
  styleUrls: ['./tilecard.component.css']
})
export class TilecardComponent implements OnInit {
  @Input()
  title : string = "Title";
  @Input()
  subTitle: string = "";
  @Input()
  description: string = "The content";
  @Input()
  smImg: string = "assets/images/study.jpg";
  @Input()
  urlMdPath: string = ""
  @Input()
  buttonName: string = 'Submit';
  @Input()
  urlPath: string = 'home';
  // the content can be organized with summary, FAQ and compendium.
  @Input()
  summary: string;
  @Input()
  faq:string = '';
  @Input()
  compendium:string ='';
  @Input()
  urlBack: string;
  @Input()
  maxNumberFiles: number = 0;

  externalUrl: boolean = false;
  selectedStudy: Study;

  style: string = "background-image: url(smImg);background-size: cover;";

  constructor(public dialog: MatDialog,
     private router: Router,
     private studyService: StudyService) {
      this.externalUrl = (this.urlPath.startsWith("http"));
  }

  ngOnInit() {
    this.style = "background-image: url(smImg);background-size: cover;";
  }

  openDialog(): void {
   let dialogRef = this.dialog.open(MyDialog, {
     width: '1400px',
     height: '800px',
     data: { title: this.title, urlMdPath: this.urlMdPath}
   });
  }

  openStudy() {
    this.selectedStudy = new Study();
    this.selectedStudy.title = this.title;
    this.selectedStudy.summary = this.summary;
    this.selectedStudy.faq = this.faq;
    this.selectedStudy.compendium = this.compendium;
    this.selectedStudy.urlBack = this.urlBack;
    this.selectedStudy.maxFile = this.maxNumberFiles;
    this.studyService.setStudy(this.selectedStudy);
    this.router.navigate(['study']);
  }

  submit() {
    this.router.navigate([this.urlPath]);
  }
}

@Component({
  selector: 'mydialog',
  templateUrl: 'dialog.html',
  styleUrls: ['./tilecard.component.css']
})
export class MyDialog {

  constructor(
    public dialogRef: MatDialogRef<TilecardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
