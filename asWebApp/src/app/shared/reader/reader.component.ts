import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})
export class ReaderComponent implements OnInit {
  @Input()
  fileName: string = "";
  @Input()
  maxIndex = 0;

  index = 0;
  currentfileName: string;

  constructor() { }

  ngOnInit() {
    this.currentfileName=this.fileName +  this.index + ".md";
  }

  next(){

    if (this.index < this.maxIndex)  {
        this.index++;
    }
    this.currentfileName=this.fileName + this.index + ".md";
  }

  previous() {
    if (this.index > 0 )  {
        this.index--;
    }
    this.currentfileName=this.fileName + this.index + ".md";
  }

  last(): boolean {
    return (this.index == (this.maxIndex - 1));
  }

  first(): boolean {
      return (this.index == 0);
    }
}
