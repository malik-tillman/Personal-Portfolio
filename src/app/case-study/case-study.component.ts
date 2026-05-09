import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CMSService } from '../cms.service';
import { SeoService } from '../seo.service';
import { toHTML } from '@portabletext/to-html';
import imageUrlBuilder from '@sanity/image-url';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-case-study',
  templateUrl: './case-study.component.html',
  styleUrls: ['./case-study.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CaseStudyComponent implements OnInit {
  public caseStudy: any;
  public portableTextHtml: string = '';

  constructor(
    private route: ActivatedRoute,
    private cmsService: CMSService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.cmsService.fetchCaseStudy(slug).then(data => {
          this.caseStudy = data;
          this.seo.update({
            title: `${data.title} | Case Study`,
            description: `Case study for ${data.title}`
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
}
