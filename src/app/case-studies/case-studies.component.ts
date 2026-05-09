import { Component, OnInit } from '@angular/core';
import { CMSService } from '../cms.service';
import { SeoService } from '../seo.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss'],
  standalone: false
})
export class CaseStudiesComponent implements OnInit {
  public caseStudiesList: any[] = [];
  public emptyCaseStudies: boolean = false;

  constructor(private cmsService: CMSService, private seo: SeoService) {
    this.seo.update({
      title: 'Case Studies',
      description: 'In-depth case studies of my recent projects.',
      keywords: 'case studies, portfolio',
    });
  }

  ngOnInit(): void {
    this.cmsService.fetchCaseStudiesList().then(studies => {
      this.caseStudiesList = studies;
      if (this.caseStudiesList.length === 0) {
        this.emptyCaseStudies = true;
      }
    });
  }
}
