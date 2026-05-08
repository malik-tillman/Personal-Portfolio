/**
 * contact.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
    selector: 'contact', templateUrl: './contact.component.html', styleUrls: ['./contact.component.scss'],
    standalone: false
})
export class ContactComponent {
  constructor(private seo: SeoService) {
    this.seo.update({
      title: 'Contact',
      description: 'Get in touch with Malik Tillman for web development, e-commerce, or design projects. Based in NJ & NYC.',
      keywords: 'contact Malik Tillman, hire developer, web development inquiry, freelance developer'
    });
  }
}
