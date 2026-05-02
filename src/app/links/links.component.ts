import { Component, Input } from '@angular/core';

@Component({
    selector: 'links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.scss'],
    standalone: false
})
export class LinksComponent {
  @Input() projects: boolean;
  @Input() contact: boolean;
  @Input() about: boolean;

  constructor() {}
}
