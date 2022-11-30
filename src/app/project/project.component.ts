/**
 * project.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FetchWorksService, Project, CDN } from '../fetch-works.service';
import { Subscription } from 'rxjs';

import Viewer from "viewerjs"

@Component({selector: 'project', templateUrl: './project.component.html', styleUrls: ['./project.component.scss']})
export class ProjectComponent implements OnDestroy, AfterViewInit {
  /* Dynamic CDN URL */
  public cdn_url:string = CDN;

  /* Unsubscribe when component destroys */
  public activatedRouterSubscription:Subscription;

  /* Dom refs */
  @ViewChildren('galleryImage') private galleryImage:QueryList<ElementRef>;
  @ViewChild('galleryContainer') private galleryContainer:ElementRef;


  /* Project Object */
  public project:Project;

  /* Media URIs */
  public imgURIs = [];
  public videoURIs = [];

  /* Error Page Toggle */
  public projectNotFound = false;

  constructor(
    private router:Router,
    private fetchWorksService:FetchWorksService,
    private activatedRoute:ActivatedRoute
  ) {}

  ngAfterViewInit() {
    /* Subscribe to activated router to get query parameters */
    this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      /* Reset project not found toggle */
      this.projectNotFound = false;

      /* Get project data */
      this.fetchWorksService.getProject(params.id).then((data:Project) => {
        /* If data was returned */
        if(data) {
          /* Cache data */
          this.project = data;

          /* Cache image URIs and initialize slider */
          if(this.project.images) {
            this.imgURIs = this.project.images.split(',');
            this.initializeViewer(this.galleryImage);
          }

          /* Cache videos URIs */
          if(this.project.videos)
            this.videoURIs = this.project.videos.split(',');
        }

        /* No data was returned */
        else {
          /* Purge projects data cache */
          this.project = null;

          /* Fire project not found trigger */
          this.projectNotFound = true;

          /* Console log error */
          console.log('error! No project was found with that ID');
        }
      });
    })
  }

  ngOnDestroy() {
    /* Unsubscribe from active subscriptions */
    if(this.activatedRouterSubscription) this.activatedRouterSubscription.unsubscribe();
  }

  initializeViewer(list) {
    if(list) {
      const _subscription = list.changes.subscribe((queryList:QueryList<ElementRef>) => {
        console.log(this.galleryImage);

        const gallery = new Viewer(this.galleryContainer.nativeElement, {

        });

        _subscription.unsubscribe();
      });
    }

    else
      throw 'List container is empty';
  }

  /**
   * ScrollToContent
   * when triggered, sets window scroll down a full height of the view (100vh)
   * */
  scrollToContent() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
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
