import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CMSService } from '../cms.service';
import { SeoService } from '../seo.service';
import { toHTML } from '@portabletext/to-html';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CaseStudyComponent implements OnInit, OnDestroy {
  public caseStudy: any;
  public portableTextHtml: string = '';
  public prevStudy: any = null;
  public nextStudy: any = null;
  private paramMapSub: any;

  constructor(
    private route: ActivatedRoute,
    private cmsService: CMSService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.paramMapSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.prevStudy = null;
        this.nextStudy = null;

        this.cmsService.fetchCaseStudy(slug).then(data => {
          this.caseStudy = data;
          this.seo.update({
            title: `${data.title} | Case Study`,
            description: `Case study for ${data.title}`
          });

          this.cmsService.fetchCaseStudiesList().then(studies => {
            const idx = studies.findIndex(s => s.slug.current === slug);
            if (idx > 0) this.prevStudy = studies[idx - 1];
            if (idx < studies.length - 1) this.nextStudy = studies[idx + 1];
          });

          if (data.body) {
            this.portableTextHtml = toHTML(data.body, {
              components: {
                types: {
                  image: ({value}: any) => {
                    const url = this.cmsService.urlFor(value).width(800).auto('format').url();
                    return `<img src="${url}" alt="${value.alt || ''}" class="portable-text-image" />
                            ${value.caption ? `<p class="caption">${value.caption}</p>` : ''}`;
                  }
                }
              }
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramMapSub) {
      this.paramMapSub.unsubscribe();
      this.paramMapSub = null;
    }
  }
}
