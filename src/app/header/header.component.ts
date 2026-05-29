/**
 * header.component
 * @author Malik Tillman
 *
 * 2022
 * */
import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { CMSService, ProjectAttributes } from '../cms.service';
import Typed from 'typed.js';
import SwiperCore, { Autoplay, SwiperOptions } from 'swiper';
SwiperCore.use([Autoplay]);

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild("typedName") private typedName: ElementRef;

  /* Handles opening and closing menu */
  public menuToggle:boolean = false;

  public caseStudiesList: any[];
  public worksList: ProjectAttributes[] = [];
  public worksSliderConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    speed: 400,
    autoplay: {
      delay: 7500,
      disableOnInteraction: false,
    },
    loop: true,
  };

  constructor(private projectService: CMSService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    projectService.fetchCaseStudiesList()
      .then( (studies: any[]) => {
        this.caseStudiesList = studies;
    })

    projectService.fetchList().then(projects => {
      const shuffled = [...projects].sort(() => Math.random() - 0.5);
      this.worksList = shuffled.slice(0, 5);
    })

    // When route changes, close menu and scroll to top
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.menuToggle = false;

        if (isPlatformBrowser(this.platformId)) window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    })
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    new Typed(this.typedName.nativeElement, {
      strings: ['Malik_Tillman'],
      typeSpeed: 100,
      startDelay: 5000,
      showCursor: false,
      loop: false,
    }).start();
  }

  /**
   * Toggles menu state by reversing boolean value */
  toggleMenu() { this.menuToggle = !this.menuToggle }
}
