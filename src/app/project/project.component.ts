/**
 * project.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, Inject, PLATFORM_ID } from '@angular/core';
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
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  /* Unsubscribe when component destroys */
  public activatedRouterSubscription: Subscription;

  /* Dom refs */
  @ViewChildren('galleryImage') private galleryImage: QueryList<ElementRef>;
  @ViewChild('galleryContainer') private galleryContainer: ElementRef;
  @ViewChild('mainContent') private mainContent: ElementRef;

  /* Project Object */
  public work: any;
  public prevWork: any = null;
  public nextWork: any = null;

  /* Media URIs */
  public imgURIs = [];
  public videoURIs = [];

  /* Error Page Toggle */
  public projectNotFound = false;
  private viewerInstance: any = null;

  constructor(
    private router: Router,
    private projectService: CMSService,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.activatedRouterSubscription = this.activatedRoute.params.subscribe(params => {
      const slug = params['slug'];
      const queryId = this.activatedRoute.snapshot.queryParams['id'];
      this.projectNotFound = false;
      this.prevWork = null;
      this.nextWork = null;

      let fetchPromise: Promise<any>;

      if (slug && !isNaN(Number(slug))) {
        fetchPromise = this.projectService.fetchProject(Number(slug));
      } else if (slug) {
        fetchPromise = this.projectService.fetchProjectBySlug(slug);
      } else if (queryId) {
        const projectId = isNaN(Number(queryId)) ? queryId : Number(queryId);
        fetchPromise = this.projectService.fetchProject(projectId as any);
      } else {
        return;
      }

      fetchPromise.then(data => {
        this.work = data;

        if (this.work) {
          const projectUrl = `${environment.siteUrl}/works/project/${this.work.slug || this.work.id}`;

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
          this.projectService.fetchList().then(projects => {
            const currentSlug = this.work.slug;
            const idx = projects.findIndex(p => p.slug === currentSlug);
            if (idx > 0) this.prevWork = projects[idx - 1];
            if (idx < projects.length - 1) this.nextWork = projects[idx + 1];
          });
        } else {
          this.projectNotFound = true;
        }
      })
    })
  }

  ngAfterViewInit() {
    this.initializeViewer(this.galleryImage);
  }

  ngOnDestroy() {
    if(this.activatedRouterSubscription) this.activatedRouterSubscription.unsubscribe();
    if (this.viewerInstance) {
      this.viewerInstance.destroy();
      this.viewerInstance = null;
    }
  }

  initializeViewer(list) {
    if (!isPlatformBrowser(this.platformId)) return;
    if(list) {
      const _subscription = list.changes.subscribe((queryList:QueryList<ElementRef>) => {
        if (this.viewerInstance) {
          this.viewerInstance.destroy();
        }
        this.viewerInstance = new Viewer(this.galleryContainer.nativeElement, {
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
    if (isPlatformBrowser(this.platformId) && this.mainContent) {
      const top = this.mainContent.nativeElement.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
