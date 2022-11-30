/**
 * works.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FetchWorksService, MetaProject, CDN } from '../fetch-works.service';
import Lottie from 'lottie-web';

@Component({selector: 'app-works', templateUrl: './works.component.html', styleUrls: ['./works.component.scss']})
export class WorksComponent implements OnDestroy, AfterViewInit {
  /* Dynamic CDN URL */
  public cdn_url:string = CDN;

  /* Project Type Title */
  public title:string;

  /* Active categories to be query for */
  private activeTypes:string[];

  /* Creative project categories */
  readonly creativeTypes:string[] = [
    'graphic',
    'video',
    'photo',
    'misc'
  ];

  /* Development project categories */
  readonly devTypes:string[] = [
    'web',
    'research',
    'app'
  ];

  /* Works list object */
  public worksList:MetaProject[] = [];

  /* Filter toggle coefficient */
  public filterToggle = false;

  /* Error Page Toggle */
  public isProjectNotFound = false;

  /* Active Router Subscription, needs to be unsubscribed */
  public activeRouterSubscription:Subscription;

  /* Child Ref for image loader animation */
  @ViewChildren('image_loader') imageLoader: QueryList<ElementRef>;

  /* Lazy load default image */
  public default_image = 'assets/lazy-thumb.jpg';

  /* Amount of works not hidden */
  public worksCount:number;

  /* Caches component sort state */
  private sorted = {
    is: false,
    desc: false
  }

  constructor(
    private fetchWorksService: FetchWorksService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    /* Subscribe to router changes */
    this.activeRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      /* Reset Project Not Found Toggle */
      this.isProjectNotFound = false;

      /* Extract type/category from parameter  */
      switch (params.type) {
        /* Multi type/category parameter */
        case 'dev':
          /* Set heading */
          this.title = 'Dev Projects';

          /* Set multiple categories */
          this.activeTypes = this.devTypes;
          break;
        case 'creative':
          /* Set heading */
          this.title = 'Creative Projects';

          /* Set multiple categories */
          this.activeTypes = this.creativeTypes;
          break;

        /* Single type/category and other parameters */
        default:
          if(params.type) {
            /* Capitalize type name for title */
            this.title = `${params.type.charAt(0).toUpperCase() + params.type.slice(1)} Projects`;

            /* Set active type */
            this.activeTypes = [params.type];
          }

          /* No parameters show all projects */
          else {
            /* Set heading */
            this.title = 'All Projects';

            /* No active category */
            this.activeTypes = [];
          }
      }

      /* If parameter had a type/category, fetch data by type/category */
      if(this.activeTypes.length > 0)
        /* Fetch projects data */
        this.fetchWorksService.getWorksListByType(this.activeTypes)
          .then((data:MetaProject[]) => {
            /* If data was returned */
            if(data.length > 0) {
              /* Cache data */
              this.worksList = data;

              /* Get non-hidden count */
              this.worksCount = 0;

              this.worksList.forEach(work => {
                if(!work.hidden)
                  this.worksCount++
              })

              /* Check if it should be sorted */
              if(this.sorted.is)
                this.sortByName(this.sorted.desc);
            }

            /* No data was returned */
            else {
              /* Purge projects data cache */
              this.worksList = [];

              /* Reset non-hidden count */
              this.worksCount = 0;

              /* Trigger projects not found event */
              this.isProjectNotFound = true;

              /* Log to console error */
              console.log('error! projects not found');
            }
          })

      /* If no parameters, fetch all types */
      else
        this.fetchWorksService.getWorksList().then((data:MetaProject[]) => {
          /* Cache project data */
          this.worksList = data;

          /* Get non-hidden count */
          this.worksCount = 0;

          this.worksList.forEach(work => {
            if(!work.hidden)
              this.worksCount++
          })

          /* Check if it needs sorting */
          if(this.sorted.is)
            this.sortByName(this.sorted.desc);
        })
    })
  }

  ngAfterViewInit() {
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

  /* Unsubscribe from subscriptions */
  ngOnDestroy() {
    if(this.activeRouterSubscription) this.activeRouterSubscription.unsubscribe();
  }

  /**
   * SortByName
   * Sorts works list by name
   * */
  sortByName(desc) {
    /* Cache Sort State */
    this.sorted.is = true;
    this.sorted.desc = desc;

    this.worksList.sort((x:MetaProject, y:MetaProject) => {
      /* Declare comparator values */
      const _x = x.name.toUpperCase();
      const _y = y.name.toUpperCase();

      /* Comparator return coefficient */
      let comp;

      /* Compare Values */
      if(_x > _y)
        comp = 1;
      else if(_x < _y)
        comp = -1;
      else
        comp = 0;

      /* Flip for ascending/descending order */
      return desc? comp * -1: comp;
    });
  }

  /**
   * FilterByType
   * Filters works list by type, navigates router to selected value
   * */
  filterByType(type) {
    /* Navigate with Params */
    if(type.value)
      this.router.navigate(['works'], {queryParams: {type: type.value}}).then();

    /* Navigate with NO Params */
     else
      this.router.navigate(['works']).then();
  }

  /**
   * ToggleFilter
   * Flip filter toggle coefficient
   * */
  toggleFilter() {
    this.filterToggle = !this.filterToggle;
  }

  /**
   * ResolveURL
   * Appends image type to image URI */
  resolveURL(uri, type) {
    if(type == 'webp')
      return `https://${this.cdn_url}/images/${uri}.webp`;

    return `https://${this.cdn_url}/images/${uri}.jpg`;
  }
}
