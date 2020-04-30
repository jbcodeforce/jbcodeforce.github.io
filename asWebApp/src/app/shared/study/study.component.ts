import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router }   from '@angular/router';
import { MatDialog } from '@angular/material';
import { Study } from './Study';
import { Subscription } from 'rxjs';
import { MyDialogComponent } from '../../shared/my-dialog/my-dialog.component';
import { StudyService } from '../study.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.css']
})
export class StudyComponent implements OnInit {

  study: Study;
  subscription: Subscription;
  stepByStep: boolean = false;

  constructor(private dialog: MatDialog,
            private router: Router,
            private studyService: StudyService ) {

  }

  ngOnInit() {
    this.study = this.studyService.getStudyAsIs();
    this.stepByStep =   ! this.study.summary.includes(".md");
  }

  openDialog(type: string): void {

       if (type === "faq") {
         let dialogRef = this.dialog.open(MyDialogComponent, {
           width: '1020px',
           data: { title: this.study.title, url: this.study.faq}
         })
       } else {
         let dialogRef = this.dialog.open(MyDialogComponent, {
           width: '1020px',
           data: { title: this.study.title, url: this.study.summary}
         })
       }
    }

    back() {
      this.router.navigate([this.study.urlBack]);
    }
}
