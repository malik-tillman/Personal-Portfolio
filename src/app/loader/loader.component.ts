/**
 * loader.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Lottie from 'lottie-web';

@Component({selector: 'loader', templateUrl: './loader.component.html', styleUrls: ['./loader.component.scss']})
export class LoaderComponent implements AfterViewInit {
  /* Loader Reference */
  @ViewChild('loader') loader_container:ElementRef;

  ngAfterViewInit(): void {
    /* Initiate Loader Animation */
    Lottie.loadAnimation({
      container: this.loader_container.nativeElement,
      path: 'assets/logo-load-data.json',
      renderer: 'svg',
      loop: true,
      autoplay: true
    })
  }
}
