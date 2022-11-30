import {Component, ElementRef, AfterViewInit, OnInit, ViewChild} from '@angular/core';

import SwiperCore, { Autoplay, SwiperOptions } from 'swiper';
import {BehaviorSubject} from 'rxjs';
import {Project} from '../fetch-works.service';
SwiperCore.use([  Autoplay]);

@Component({
  selector: 'swiper-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class SwiperToolboxComponent implements AfterViewInit, OnInit {
  @ViewChild('toolbox') private toolboxRef:ElementRef;

  public toolbox =  new BehaviorSubject<{}>({
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
      image: "assets/tag-icons/react.png"
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
  });

  public config: SwiperOptions;

  constructor() {

  }

  ngOnInit() {
    this.config = {
      autoplay: {
        delay: 0
      },
      speed: 2000,
      loop: true,
      width: 250,
      slidesPerView: 'auto'
    }
  }

  ngAfterViewInit(): void {
  }
}
