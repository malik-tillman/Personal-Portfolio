/**
 * works.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CMSService, ProjectAttributes} from '../cms.service';
import { SeoService } from '../seo.service';
import { environment } from '../../environments/environment';
let Lottie: any;
if (typeof window !== 'undefined') {
  Lottie = require('lottie-web');
}

@Component({
    selector: 'app-works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.scss'],
    standalone: false,
    host: { 'ngSkipHydration': 'true' }
})
export class WorksComponent implements OnInit, AfterViewInit {
  @Input() public condensed: boolean = false;

  /* Track which cards have expanded tags */
  public expandedTags = new Set<number>();
  public overflowingTags = new Set<number>();

  @ViewChildren('tagsContainer') tagsContainers: QueryList<ElementRef>;

  /* Child Ref for image loader animation */
  @ViewChildren('image_loader') imageLoader: QueryList<ElementRef>;

  /* Lazy load default image */
  public default_image = 'assets/lazy-thumb.jpg';

  public worksList:any[];

  public worksCount: number;

  public emptyProjects: Boolean;

  constructor(private projectService: CMSService, @Inject(PLATFORM_ID) private platformId: Object, private seo: SeoService) {}

  ngOnInit() {
    this.seo.update({
      title: 'Works',
      description: 'Browse the portfolio of Malik Tillman featuring web development, e-commerce, graphic design, and more.',
      keywords: 'portfolio, web projects, e-commerce projects, Malik Tillman works, developer portfolio',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Works | Malik Tillman',
        'description': 'Browse the portfolio of Malik Tillman featuring web development, e-commerce, graphic design, and more.',
        'url': environment.siteUrl + '/works'
      }
    });

    this.emptyProjects = false;

    this.projectService.fetchList().then( projects => {
      console.log("Projects", projects)

      const favoriteProjects = [
        'goshi',
        'rita-hazan',
        'romeo-hunte-nyc'
      ]

      this.worksCount = projects.length;
      this.worksList = this.condensed
        ? projects.filter(project => favoriteProjects.includes(project.slug))
        : projects;

      if(!this.condensed) {
        this.shuffle(this.worksList);
      }

      if (this.worksList.length === 0)
        this.emptyProjects = true;

      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.checkTagsOverflow(), 100);
      }
    })
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    /* Initiate loader animation in lazy loaded cards */
    let _loaderSubscription = this.imageLoader.changes.subscribe((queryList:QueryList<ElementRef>) => {
      queryList.toArray().forEach(loader => {
        Lottie.loadAnimation({
          container: loader.nativeElement,
          path: 'assets/logo-load-data.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        })
      })

      _loaderSubscription.unsubscribe();
    })

  }

  private checkTagsOverflow() {
    if (!this.tagsContainers) return;
    const updated = new Set(this.overflowingTags);
    this.tagsContainers.forEach((ref: ElementRef) => {
      const el = ref.nativeElement as HTMLElement;
      const id = Number(el.getAttribute('data-work-id'));
      if (isNaN(id)) return;
      if (el.scrollHeight > el.clientHeight) {
        updated.add(id);
      } else if (!this.expandedTags.has(id)) {
        updated.delete(id);
      }
    });
    this.overflowingTags = updated;
  }

  toggleTags(workId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.expandedTags.has(workId)) {
      this.expandedTags.delete(workId);
    } else {
      this.expandedTags.add(workId);
    }
  }

  shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }
}
