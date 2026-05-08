/**
 * about.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component } from '@angular/core';
import { CMSService } from '../cms.service';
import { SeoService } from '../seo.service';

@Component({
    selector: 'about', templateUrl: './about.component.html', styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent {
  public aboutCopy: string[];

  constructor(private cms: CMSService, private seo: SeoService) {
    this.seo.update({
      title: 'About',
      description: 'Learn about Malik Tillman, a full-stack e-commerce developer based in NJ and NYC with expertise in React, Angular, Shopify, and more.',
      keywords: 'about Malik Tillman, web developer background, developer skills, full-stack developer'
    });

    cms.fetchAbout().then((copy: string[]) => this.aboutCopy = copy)
  }
}
