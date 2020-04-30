import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Study } from './study/Study';
/**
Support two models to share data, using get object directly, or with a subscription.
*/
@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private studyToShare = new Subject<Study>();
  private study: Study;

  constructor() { }

  setStudy(aStudy: Study) {
    this.studyToShare.next(aStudy);
    this.study = aStudy;
  }

  getStudy(): Observable<Study> {
    return this.studyToShare.asObservable();
  }

  getStudyAsIs(): Study {
    return this.study;
  }
}
