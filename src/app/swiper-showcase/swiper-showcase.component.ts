import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CMSService, ProjectAttributes } from '../cms.service';

import SwiperCore, { Navigation, Autoplay, SwiperOptions, Pagination } from 'swiper';
SwiperCore.use([ Navigation, Autoplay, Pagination ]);

@Component({
  selector: 'swiper-showcase',
  templateUrl: './swiper-showcase.component.html',
  styleUrls: ['./swiper-showcase.component.scss']
})
export class SwiperShowcaseComponent implements OnInit, AfterViewInit {
  @ViewChild('container') private containerRef: ElementRef;
  @ViewChild('next') private nextRef: ElementRef;
  @ViewChild('prev') private prevRef: ElementRef;

  public worksList: ProjectAttributes[] = [];

  public config: SwiperOptions;
  private _swiperRef_;

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

        if (this._swiperRef_) {
          this._swiperRef_.slideTo(this.worksList.length - 1, 1000);
        }

        this.config.initialSlide = this.worksList.length - 1;

        this.updateSwiper();
    });

    this.config = {
      loop: this.loop,
      loopedSlides: this.loop ? this.ids?.length || this.projectService.DEFAULTS.length : null,

      slidesPerView: 1,
      spaceBetween: this.spacing_m != undefined ? this.spacing_m : 0,
      width: this.width != undefined ? this.width : null,

      speed: this.speed != undefined ? this.speed : 250,
      autoplay: this.autoplay ? {
        delay: this.delay != undefined ? this.delay : 2000,
        pauseOnMouseEnter: false,
        disableOnInteraction: false,
        reverseDirection: false
      } : false,
      breakpoints: {
        630: {
          slidesPerView: this.perPage != undefined && this.perPage < 3 ? this.perPage : 2,
          spaceBetween: this.spacing != undefined ? this.spacing : 25,
        },
        1200: {
          slidesPerView: this.perPage != undefined ? this.perPage : 4,
          spaceBetween: this.spacing != undefined ? this.spacing : 25,
        }
      }
    };
  }

  ngAfterViewInit() {
    if (this.arrows) {
      this.config.navigation = {
        nextEl: this.nextRef.nativeElement,
        prevEl: this.prevRef.nativeElement
      };
    } else {
      this.containerRef.nativeElement.classList.add("no-arrows")
    }
  }

  onSwiper(e) { this._swiperRef_ = e; }

  updateSwiper() {
    if (this._swiperRef_)
      this._swiperRef_.update();
  }

  nextSlide() {
    if (this._swiperRef_)
      this._swiperRef_.slideNext();
  }

  prevSlide() {
    if (this._swiperRef_)
      this._swiperRef_.slidePrev();
  }
}
