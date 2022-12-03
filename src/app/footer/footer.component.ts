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

  private quote_backup = [
    'Welcome to MalikTillman.com!',
    '"What\'s science to a man that can\'t apply it?" - Roc Marciano',
    'This site was designed and developed by Malik Tillman',
    'A Leek Production'
  ]

  constructor(private cms: CMSService) {}

  ngOnInit(): void {
    this.cms.fetchQuotes().then(quotes => {
      /* Initiate typed text */
      new Typed(this.typedFooterRef.nativeElement, {
        strings: quotes.length > 0 ?
          quotes.map(quote => `${quote.text} ${quote.author ? " - " + quote.author : ""}`.trim()) :
          this.quote_backup
        ,
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
