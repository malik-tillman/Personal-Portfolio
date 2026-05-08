/**
 * home.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Typed from 'typed.js';
import { SeoService } from '../seo.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private seo: SeoService) {
    this.seo.update({
      title: 'Malik Tillman',
      description: 'Malik Tillman is a full-stack e-commerce developer based in NJ & NYC, crafting digital experiences with the Web.',
      keywords: 'Malik Tillman, full-stack developer, e-commerce developer, web developer, NYC developer, NJ developer, portfolio',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Malik Tillman',
        'url': environment.siteUrl,
        'jobTitle': 'Full-Stack E-Commerce Developer',
        'description': 'Full-stack e-commerce developer based in NJ & NYC, crafting digital experiences with the Web.',
        'sameAs': [
          'https://github.com/maliktillman'
        ],
        'knowsAbout': ['Web Development', 'E-Commerce', 'React', 'Angular', 'Shopify', 'Graphic Design']
      }
    });
  }
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

    if (isPlatformBrowser(this.platformId)) {
      /* Initiate Typed object */
          new Typed('#typed', {
          strings: this.typedText,
          typeSpeed: 75,
          backSpeed: 100,
          backDelay: 1000,
          smartBackspace: true,
          showCursor: true,
          cursorChar: '',
          autoInsertCss: true,
          loop: true,
          shuffle: true,
          }).start();
    }
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
