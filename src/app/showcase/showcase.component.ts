import {Component, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, Input} from '@angular/core';
import { FetchWorksService, Project, CDN } from '../fetch-works.service';
import Splide, {SplideOptions, SplideType} from '@splidejs/splide';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements AfterViewInit {
  /* Dynamic CDN URL */
  public cdnUrl:string = CDN;

  /* Favorite projects ID */
  public favoritesId:number[] = [1,2,3,4];

  /* Caches favorites projects */
  public worksList:Project[] = [];

  /* Image and Video Spliders */
  private imageSplide:Splide;

  @ViewChildren('images') private _imagesRef:QueryList<ElementRef>;
  @ViewChild('container') private containerRef:ElementRef;
  @ViewChild('images_container') private imagesContainerRef:ElementRef;
  @ViewChild('arrows') private arrowsRef:ElementRef;

  @Input()
  perPage:number;

  @Input()
  ids:number[];

  @Input()
  omitID:number;

  @Input()
  spacing:string;

  @Input()
  type:SplideType;

  @Input()
  hideTitle:boolean;

  @Input()
  width:number;

  @Input()
  arrows:boolean;

  @Input()
  autoplay:boolean;

  _subscription:Subscription;

  constructor(private fetchWorksService: FetchWorksService) {}

  ngAfterViewInit() {
    if (this.omitID)
      this.ids.splice(this.ids.indexOf(this.omitID), 1);

    this.fetchWorksService.getWorksListByIds(this.ids ? this.ids : this.favoritesId)
      .then(( data:Project[] ) => {
        this.worksList = data;
      });

    this.initializeSplider();
  }

  /**
   * InitializeSplider
   * Resets current splider instance and initializes a new one when content is ready in Dom
   * */
  _initializeSplider() {
    const config: SplideOptions = {
      type: this.type ? this.type : 'loop',
      rewind: false,
      autoplay: this.autoplay !== false,
      interval: 5000,
      easing: 'ease',
      trimSpace: true,
      perPage: this.perPage ? this.perPage : 3,
      perMove: 1,
      autoWidth: false,
      width: '100%',
      gap: this.spacing ? this.spacing : '15px',
      pagination: false,
      arrows: this.arrows !== false,
      breakpoints: {
        630: {
          perPage: 1
        }
      }
    };

    if (config.arrows === false) {
      this.arrowsRef.nativeElement.classList.add('hidden');
    }

    if (this.width) {
      config.fixedWidth = this.width;
    }

    /* Initialize splider */
    this.imageSplide = new Splide(this.imagesContainerRef.nativeElement, config).mount();
  }

  initializeSplider() {
    if(this._imagesRef) {
      this._subscription = this._imagesRef.changes.subscribe({
        next: (queryList: QueryList<ElementRef>) => {
          setTimeout(() => {
            this._initializeSplider();

            this.containerRef.nativeElement.classList.add("loaded");
          }, 1000)
        }
      });
    }
  }

  /**
   * ResolveURL
   * Appends image type to image URI */
  resolveURL(uri, type) {
    if(type == 'webp')
      return `https://${this.cdnUrl}/images/${uri}.webp`;

    return `https://${this.cdnUrl}/images/${uri}.jpg`;
  }
}
