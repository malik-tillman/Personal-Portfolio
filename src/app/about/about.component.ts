/**
 * about.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component } from '@angular/core';
import { CMSService } from '../cms.service';

@Component({selector: 'about', templateUrl: './about.component.html', styleUrls: ['./about.component.scss']})
export class AboutComponent {
  public aboutCopy: string[];

  constructor(private cms: CMSService) {
    cms.fetchAbout().then((copy: string[]) => this.aboutCopy = copy)
  }
}
