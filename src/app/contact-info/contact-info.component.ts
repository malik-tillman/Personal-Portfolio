import {Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

@Component({
  selector: 'contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements AfterViewInit {
  @ViewChild('container')
  private _container:ElementRef;

  @Input()
  alignment: string;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.alignment === "end")
      this._container.nativeElement.classList.add("end");
  }

}
