/**
 * header.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { FetchWorksService, MetaProject, CDN, FavoritesId } from '../fetch-works.service';
import Typed from 'typed.js';

@Component({selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.scss']})
export class HeaderComponent implements AfterViewInit {
  /* Dynamic CDN URL */
  public cdnUrl:string = CDN;

  /* Handles opening and closing menu */
  public menuToggle:boolean = false;

  /* Favorite projects ID */
  public favoritesId:number[] = FavoritesId;

  /* Caches favorites projects */
  public worksList:MetaProject[] = [];

  constructor(
    private fetchWorksService: FetchWorksService,
    private router:Router
  ) {
    /* Fetch data for favorite works */
    fetchWorksService.getWorksListByIds(this.favoritesId).then(( data:MetaProject[] ) => {
      this.worksList = data;
    });

    /* When route changes, close menu and scroll to top */
    router.events.subscribe(event => {
      if(event instanceof NavigationStart){
        /* Close menu */
        this.menuToggle = false;

        /* Scroll to top */
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    })
  }

  ngAfterViewInit(): void {
    /* Initiate typed header text (the naughty way) */
    new Typed('#name', {
      strings: ['Malik_Tillman'],
      typeSpeed: 100,
      startDelay: 5000,
      showCursor: false,
      loop: false,
    }).start();
  }

  /**
   * ToggleMenu
   * Toggles menu state by reversing boolean value */
  toggleMenu() { this.menuToggle = !this.menuToggle }

  /**
   * ResolveURL
   * Appends image type to image URI */
  resolveURL(uri, type) {
    if(type == 'webp')
      return `https://${this.cdnUrl}/images/${uri}.webp`;

    return `https://${this.cdnUrl}/images/${uri}.jpg`;
  }
}
