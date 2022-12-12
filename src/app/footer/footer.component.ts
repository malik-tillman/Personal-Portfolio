/**
 * footer.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Typed from 'typed.js';
import { CMSService } from '../cms.service';

@Component({selector: 'footer', templateUrl: './footer.component.html', styleUrls: ['./footer.component.scss']})
export class FooterComponent implements OnInit {
  @ViewChild("typedFooter") typedFooterRef: ElementRef;

  constructor(private cms: CMSService) {}

  ngOnInit(): void {
    this.cms.fetchQuotes().then(quotes => {
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
    })

  }
}
