/**
 * loader.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { AfterViewInit, Component, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
let Lottie: any;
if (typeof window !== 'undefined') {
  Lottie = require('lottie-web');
}

@Component({
    selector: 'loader', templateUrl: './loader.component.html', styleUrls: ['./loader.component.scss'],
    standalone: false
})
export class LoaderComponent implements AfterViewInit {
  /* Loader Reference */
  @ViewChild('loader') loader_container:ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
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
