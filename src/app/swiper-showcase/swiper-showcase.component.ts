import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CMSService, ProjectAttributes } from '../cms.service';

@Component({
    selector: 'swiper-showcase',
    templateUrl: './swiper-showcase.component.html',
    styleUrls: ['./swiper-showcase.component.scss'],
    standalone: false
})
export class SwiperShowcaseComponent implements OnInit, AfterViewInit {
  @ViewChild('container') private containerRef: ElementRef;
  @ViewChild('swiperEl') private swiperElRef: ElementRef;
  @ViewChild('next') private nextRef: ElementRef;
  @ViewChild('prev') private prevRef: ElementRef;

  public worksList: ProjectAttributes[] = [];

  @Input() hideTitle: boolean;
  @Input() ids: number[];
  @Input() omitID: number;
  @Input() loop: boolean;
  @Input() arrows: boolean;
  @Input() perPage: number;
  @Input() spacing: number;
  @Input() spacing_m: number;
  @Input() width: number;
  @Input() speed: number;
  @Input() autoplay: boolean;
  @Input() delay: number;

  public DISABLED = false;

  constructor(private projectService: CMSService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.omitID && this.ids) {
      this.ids.splice(this.ids.indexOf(this.omitID), 1);
    }

    this.projectService.fetchListByID(this.ids ? this.ids : this.projectService.DEFAULTS)
      .then((projects) => {
        this.worksList = projects;
        this.DISABLED = !(this.worksList.length > 0);
        this.cdr.detectChanges();

        if (!this.DISABLED) {
          setTimeout(() => this.initSwiper(), 0);
        }
    });
  }

  ngAfterViewInit() {
    if (!this.arrows) {
      this.containerRef?.nativeElement.classList.add("no-arrows");
    }
  }

  private initSwiper() {
    const swiperEl = this.swiperElRef?.nativeElement;
    if (!swiperEl) return;

    swiperEl.initialize();
  }
}
