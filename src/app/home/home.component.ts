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
import { CMSService } from '../cms.service';
import SwiperCore, { Autoplay, SwiperOptions } from 'swiper';
SwiperCore.use([Autoplay]);

@Component({
    selector: 'home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  public caseStudiesList: any[] = [];
  public caseStudySliderConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 12,
    speed: 400,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    loop: true,
    preventClicks: false,
    preventClicksPropagation: false,
  };

  /* Text to be typed */
  typedText = [
    'System Design',
    'Full-Stack Development',
    'Data Engineering',
    'Data Science',
    'Machine Learning',
    'LLM Orchestration',
    'Artificial Intelligence',
    'Data Visualization',
    'Standardization & Best Practices',
    'React',
    'Node.js',
    'Python',
    'Java',
    'Angular',
    'Shopify',
    'Android Development',
    'IOS Development'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private seo: SeoService, private cmsService: CMSService) {
    this.cmsService.fetchCaseStudiesList().then(studies => {
      this.caseStudiesList = studies;
    });
    const skillsString = this.typedText.join(', ');

    this.seo.update({
      title: 'Malik Tillman',
      description: `Senior Full-Stack Engineer based in NJ & NYC, crafting digital experiences with ${skillsString}.`,
      keywords: `Malik Tillman, Senior Full-Stack Engineer, developer, NYC developer, NJ developer, portfolio, ${skillsString}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Malik Tillman',
        'url': environment.siteUrl,
        'jobTitle': 'Senior Full-Stack Engineer',
        'description': `Senior Full-Stack Engineer based in NJ & NYC, crafting digital experiences with ${skillsString}.`,
        'sameAs': [
          'https://github.com/maliktillman'
        ],
        'knowsAbout': this.typedText
      }
    });
  }

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
