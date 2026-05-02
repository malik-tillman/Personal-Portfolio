/**
 * home.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
    selector: 'home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  /* Text to be typed */
  typedText = [
    'Web Design',
    'Photography',
    'Videography',
    'Marketing',
    'Advertisement',
    'Android Development',
    'Game Development'
  ];

  featured = true;

  ngOnInit(): void {
    /* Add periods to end of strings */
    this.addPeriod(this.typedText);

    // /* Initiate Typed object */
    // new Typed('#typed', {
    //   strings: this.typedText,
    //   typeSpeed: 75,
    //   backSpeed: 100,
    //   backDelay: 1000,
    //   smartBackspace: true,
    //   showCursor: true,
    //   cursorChar: '',
    //   autoInsertCss: true,
    //   loop: true,
    //   shuffle: true
    // }).start();
  }

  /**
   * AddPeriod
   * Adds a period to the end of each string in an array */
  addPeriod(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i] + '.';
    }
    return arr;
  }
}
