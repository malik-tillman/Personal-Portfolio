import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  public expandedTags: Set<string> = new Set();
  public overflowingTags: Set<string> = new Set();

  @ViewChildren('tagsContainer') tagsContainers: QueryList<ElementRef>;

  public caseStudiesList: any[] = [];
  public caseStudiesCount: number;
  public emptyCaseStudies: boolean = false;

  constructor(private cmsService: CMSService, private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.seo.update({
      title: 'Case Studies',
      description: 'In-depth case studies of my recent projects.',
      keywords: 'case studies, portfolio',
    });
  }

  private checkTagsOverflow() {
    if (!this.tagsContainers) return;
    const updated = new Set(this.overflowingTags);
    this.tagsContainers.forEach((ref: ElementRef) => {
      const el = ref.nativeElement as HTMLElement;
      const id = el.getAttribute('data-study-slug');
      if (!id) return;
      if (el.scrollHeight > el.clientHeight) {
        updated.add(id);
      } else if (!this.expandedTags.has(id)) {
        updated.delete(id);
      }
    });
    this.overflowingTags = updated;
  }

  toggleTags(studySlug: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.expandedTags.has(studySlug)) {
      this.expandedTags.delete(studySlug);
    } else {
      this.expandedTags.add(studySlug);
    }
  }

  ngOnInit(): void {
    this.cmsService.fetchCaseStudiesList().then(studies => {
      this.caseStudiesCount = studies.length;
      this.caseStudiesList = this.condensed ? studies.slice(0, 3) : studies;
      if (this.caseStudiesList.length === 0) {
        this.emptyCaseStudies = true;
      }

      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.checkTagsOverflow(), 100);
      }
    });
  }
}
