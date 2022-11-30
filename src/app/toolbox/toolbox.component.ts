import {Component, ElementRef, AfterViewInit, OnInit, ViewChild} from '@angular/core';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent implements AfterViewInit, OnInit {
  @ViewChild('toolbox') private toolboxRef:ElementRef;

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    new Splide(this.toolboxRef.nativeElement, {
      type: 'loop',
      autoWidth: true,
      autoplay: true,
      pauseOnHover: true,
      speed: 2000,
      interval: 0,
      rewind: false,
      easing: "linear",
      focus: 'center',
      trimSpace: false,
      gap: "10px",
      pagination: false,
      drag: false,
      arrows: false,
      perMove: 1,
      breakpoints: {
        630: {
        }
      }
    }).mount();
  }
}
