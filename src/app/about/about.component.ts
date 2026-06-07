/**
 * about.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component } from '@angular/core';
import { CMSService } from '../cms.service';
import { SeoService } from '../seo.service';
import { toHTML } from '@portabletext/to-html';

@Component({
    selector: 'about', templateUrl: './about.component.html', styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent {
  public aboutHtml: string = '';

  constructor(private cms: CMSService, private seo: SeoService) {
    this.seo.update({
      title: 'About',
      description: 'Learn about Malik Tillman, a full-stack e-commerce developer based in NJ and NYC with expertise in React, Angular, Shopify, and more.',
      keywords: 'about Malik Tillman, web developer background, developer skills, full-stack developer',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'mainEntity': {
          '@type': 'Person',
          'name': 'Malik Tillman',
          'description': 'Full-stack e-commerce developer based in NJ & NYC.'
        }
      }
    });

    cms.fetchAbout().then((blocks: any[]) => {
      this.aboutHtml = toHTML(blocks);
    })
  }
}
