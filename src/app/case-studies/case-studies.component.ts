import { Component, OnInit, Input } from '@angular/core';
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
  @Input() public condensed: boolean = false;

  public caseStudiesList: any[] = [];
  public caseStudiesCount: number;
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
      this.caseStudiesCount = studies.length;
      this.caseStudiesList = this.condensed ? studies.slice(0, 3) : studies;
      if (this.caseStudiesList.length === 0) {
        this.emptyCaseStudies = true;
      }
    });
  }
}
