/**
 * works.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CMSService, ProjectAttributes} from '../cms.service';
import Lottie from 'lottie-web';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements AfterViewInit {
  /* Child Ref for image loader animation */
  @ViewChildren('image_loader') imageLoader: QueryList<ElementRef>;

  /* Lazy load default image */
  public default_image = 'assets/lazy-thumb.jpg';

  public worksList:ProjectAttributes[];

  public emptyProjects: Boolean;

  constructor(private projectService: CMSService) {
    this.emptyProjects = false;

    this.projectService.fetchList().then( projects => {
      this.worksList = projects;

      this.shuffle(this.worksList);

      if (this.worksList.length === 0)
        this.emptyProjects = true;
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

  shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }
}
