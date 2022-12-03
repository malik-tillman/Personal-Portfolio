/**
 * project.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CMSService, ProjectAttributes } from '../cms.service';
import { Subscription } from 'rxjs';

import Viewer from "viewerjs"

@Component({selector: 'project', templateUrl: './project.component.html', styleUrls: ['./project.component.scss']})
export class ProjectComponent implements OnDestroy, AfterViewInit {
  /* Unsubscribe when component destroys */
  public activatedRouterSubscription: Subscription;

  /* Dom refs */
  @ViewChildren('galleryImage') private galleryImage: QueryList<ElementRef>;
  @ViewChild('galleryContainer') private galleryContainer: ElementRef;

  /* Project Object */
  public work: ProjectAttributes;

  /* Media URIs */
  public imgURIs = [];
  public videoURIs = [];

  /* Error Page Toggle */
  public projectNotFound = false;

  constructor(
    private router: Router,
    private projectService: CMSService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.activatedRouterSubscription = this.activatedRoute.queryParams.subscribe(params => {
      this.projectNotFound = false;

      this.projectService.fetchProject(params.id).then(data => {
        this.work = data;

        this.initializeViewer(this.galleryImage);
      })
    })
  }

  ngOnDestroy() {
    if(this.activatedRouterSubscription) this.activatedRouterSubscription.unsubscribe();
  }

  initializeViewer(list) {
    if(list) {
      const _subscription = list.changes.subscribe((queryList:QueryList<ElementRef>) => {
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
}
