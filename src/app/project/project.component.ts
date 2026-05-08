/**
 * project.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CMSService, ProjectAttributes } from '../cms.service';
import { Subscription } from 'rxjs';
import { SeoService } from '../seo.service';
import { environment } from '../../environments/environment';

import Viewer from "viewerjs"

@Component({
    selector: 'project', templateUrl: './project.component.html', styleUrls: ['./project.component.scss'],
    standalone: false
})
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
    private activatedRoute: ActivatedRoute,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    this.activatedRouterSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id') || this.activatedRoute.snapshot.queryParams['id'];
      this.projectNotFound = false;

      if (!id) return;

      const projectId = isNaN(Number(id)) ? id : Number(id);
      this.projectService.fetchProject(projectId as any).then(data => {
        this.work = data;

        if (this.work) {
          const isPathParam = !!params.get('id');
          const projectUrl = isPathParam 
            ? `${environment.siteUrl}/works/project/${this.work.id}`
            : `${environment.siteUrl}/works/project?id=${this.work.id}`;

          this.seo.update({
            title: this.work.title,
            description: this.work.description || (this.work.title + ' - a project by Malik Tillman.'),
            url: projectUrl,
            image: this.work.thumbnail_src?.url,
            type: 'article',
            keywords: this.work.tags ? this.work.tags.replace(/,/g, ', ') + ', Malik Tillman' : 'project, Malik Tillman',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              'name': this.work.title,
              'description': this.work.description,
              'author': { '@type': 'Person', 'name': 'Malik Tillman' },
              'dateCreated': this.work.createdAt,
              'url': projectUrl
            }
          });
        }

        this.initializeViewer(this.galleryImage);
      })
    })
  }

  ngOnDestroy() {
    if(this.activatedRouterSubscription) this.activatedRouterSubscription.unsubscribe();
  }

  initializeViewer(list) {
    if (!isPlatformBrowser(this.platformId)) return;
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
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }
  }
}
