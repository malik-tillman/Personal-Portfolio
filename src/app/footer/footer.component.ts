/**
 * footer.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, ElementRef, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Typed from 'typed.js';
import { CMSService } from '../cms.service';

@Component({
    selector: 'footer', templateUrl: './footer.component.html', styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent implements OnInit {
  @ViewChild("typedFooter") typedFooterRef: ElementRef;

  constructor(private cms: CMSService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.cms.fetchQuotes().then(quotes => {
      if (isPlatformBrowser(this.platformId)) {
        /* Initiate typed text */
        new Typed(this.typedFooterRef.nativeElement, {
          strings: quotes.map(quote => `${quote.text} ${quote.author ? " - " + quote.author : ""}`.trim()),
          typeSpeed: 25,
          backSpeed: 50,
          backDelay: 15000,
          smartBackspace: true,
          showCursor: true,
          cursorChar: '',
          autoInsertCss: true,
          loop: true,
          shuffle: true
        }).start();
      }
    })
  }
}
