/**
 * footer.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';

@Component({selector: 'footer', templateUrl: './footer.component.html', styleUrls: ['./footer.component.scss']})
export class FooterComponent implements OnInit {
  ngOnInit(): void {
    /* Initiate typed text */
    new Typed('.footer-text', {
      /* Footer taglines */
      strings: [
        'Welcome to MalikTillman.com!',
        '"What\'s science to a man that can\'t apply it?" - Roc Marciano',
        'This site was designed and developed by Malik Tillman',
        'A Leek Production'
      ],
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
}
