import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CMSService, ProjectAttributes } from '../cms.service';

@Component({
    selector: 'swiper-showcase',
    templateUrl: './swiper-showcase.component.html',
    styleUrls: ['./swiper-showcase.component.scss'],
    standalone: false
})
export class SwiperShowcaseComponent implements OnInit, AfterViewInit {
  @ViewChild('container') private containerRef: ElementRef;
  @ViewChild('next') private nextRef: ElementRef;
  @ViewChild('prev') private prevRef: ElementRef;
  @ViewChild('swiperEl') private swiperElRef: ElementRef;

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

  constructor(private projectService: CMSService) {}

  ngOnInit() {
    if (this.omitID && this.ids) {
      this.ids.splice(this.ids.indexOf(this.omitID), 1);
    }

    this.projectService.fetchListByID(this.ids ? this.ids : this.projectService.DEFAULTS)
      .then((projects) => {
        this.worksList = projects;
        this.DISABLED = !(this.worksList.length > 0);
    });
  }

  ngAfterViewInit() {
    if (this.arrows) {
      const swiperEl = this.swiperElRef.nativeElement as any;
      swiperEl.addEventListener('swiperinit', () => {
        const swiper = swiperEl.swiper;
        swiper.params.navigation.nextEl = this.nextRef.nativeElement;
        swiper.params.navigation.prevEl = this.prevRef.nativeElement;
        swiper.navigation.update();
      });
    } else {
      this.containerRef.nativeElement.classList.add("no-arrows")
    }
  }

  nextSlide() {
    const swiperEl = this.swiperElRef.nativeElement as any;
    if (swiperEl.swiper) {
      swiperEl.swiper.slideNext();
    }
  }

  prevSlide() {
    const swiperEl = this.swiperElRef.nativeElement as any;
    if (swiperEl.swiper) {
      swiperEl.swiper.slidePrev();
    }
  }
}
