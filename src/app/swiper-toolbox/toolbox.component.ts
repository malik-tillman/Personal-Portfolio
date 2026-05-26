import {Component, AfterViewInit, OnInit, Input} from '@angular/core';

import SwiperCore, { Autoplay, SwiperOptions, FreeMode } from 'swiper';
import {config} from 'rxjs';
SwiperCore.use([Autoplay, FreeMode]);

@Component({
    selector: 'swiper-toolbox',
    templateUrl: './toolbox.component.html',
    styleUrls: ['./toolbox.component.scss'],
    standalone: false
})
export class SwiperToolboxComponent implements AfterViewInit, OnInit {
  @Input() public centered: boolean = false;

  public toolbox: object[] = [];
  public config: SwiperOptions;

  private __dupeFactor__ = 2
  private __toolbox__ = {
    shopify: {
      title: "Shopify",
      url: "https://www.shopify.com/",
      image: "assets/tag-icons/shopify-logo.png"
    },
    js: {
      title: "Javascript",
      url: "https://developer.mozilla.org/en-US/docs/Web/javascript",
      image: "assets/tag-icons/javascript.png"
    },
    node: {
      title: "Node JS",
      url: "https://nodejs.org/en/",
      image: "assets/tag-icons/node.png"
    },
    react: {
      title: "React",
      url: "https://reactjs.org/",
      image: "assets/tag-icons/react-1.png"
    },
    sass: {
      title: "SASS",
      url: "https://sass-lang.com/",
      image: "assets/tag-icons/scss.png"
    },
    python: {
      title: "Python",
      url: "https://www.python.org/",
      image: "assets/tag-icons/python.png"
    },
    php: {
      title: "PHP",
      url: "https://www.php.net/",
      image: "assets/tag-icons/php.png"
    },
    csharp: {
      title: "C#",
      url: "https://docs.microsoft.com/en-us/dotnet/csharp/",
      image: "assets/tag-icons/csharp.png"
    },
    cplusplus: {
      title: "C++",
      url: "https://docs.microsoft.com/en-us/cpp/?view=vs-2019",
      image: "assets/tag-icons/c++.png"
    },
    java: {
      title: "Java",
      url: "https://docs.oracle.com/javase/7/docs/api/",
      image: "assets/tag-icons/java.png"
    },
    adobe: {
      title: "Adobe CC",
      url: "https://www.adobe.com/products/catalog.html#category=creativity-design&types=desktop",
      image: "assets/tag-icons/adobe.png"
    },
    figma: {
      title: "Figma",
      url: "https://www.figma.com/",
      image: "assets/tag-icons/figma.png"
    }
  };

  constructor() {
    for (let i = 0; i <= this.__dupeFactor__; i++)
      for (const [handle, tool] of Object.entries(this.__toolbox__))
        this.toolbox.push(tool);
  }

  ngOnInit() {
    this.config = {
      autoplay: {
        delay: 0,
        pauseOnMouseEnter: false,
        disableOnInteraction: false,
        reverseDirection: false
      },
      noSwiping: true,
      allowTouchMove: false,
      speed: 5000,
      loop: true,
      loopedSlides: this.toolbox?.length || null,
      loopFillGroupWithBlank: false,
      loopedSlidesLimit: false,
      slidesPerView: "auto",
      slidesPerGroup: 1,
      centeredSlides: true,
      simulateTouch : false,
      spaceBetween: 15,
      freeMode: false,
      width: 80,
      observer: true,
      breakpoints: {
        630: {
          width: 100,
          spaceBetween: 50,
        }
      }
    }
  }

  ngAfterViewInit(): void { }
}
