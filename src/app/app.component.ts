/**
 * app.component
 * @author Malik Tillman
 *
 * 2020
 * */
import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent {
  /* Load toggle */
  public loaded = false;

  constructor(
    private router:Router,
    private loader:LoadingBarService
  ) {
    /* Subscribe to routing service */
    this.router.events.subscribe(async (event) => {
      /* Reset load toggle */
      this.loaded = this.router.url !== '/home' && this.router.url !== '/works';

      /* Lock scroll */
      document.body.style.overflow = !this.loaded ? 'hidden' : 'unset';

      /* Start loading bar */
      if(event instanceof NavigationStart) {
        this.loader.useRef().start();
      }

      /* End loading animations */
      else {
        /* Artificial wait time (OH NO 🤯 ... ik) */
        await this.sleep(500);

        /* Finish load bar */
        this.loader.useRef().complete();

        /* Another artificial wait time */
        await this.sleep(250);

        /* Set loaded toggle */
        this.loaded = true;

        /* Allow scroll */
        document.body.style.overflow = 'unset';
      }
    })

    /* Console log ascii art */
    const asciiTitle = `
      /$$$$$$        /$$      /$$$$$$$$/$$$$$$$$/$$   /$$
     /$$__  $$      | $$     | $$_____| $$_____| $$  /$$/
    | $$  \\ $$      | $$     | $$     | $$     | $$ /$$/
    | $$$$$$$$      | $$     | $$$$$  | $$$$$  | $$$$$/
    | $$__  $$      | $$     | $$__/  | $$__/  | $$  $$
    | $$  | $$      | $$     | $$     | $$     | $$\\  $$
    | $$  | $$      | $$$$$$$| $$$$$$$| $$$$$$$| $$ \\  $$
    |__/  |__/      |________|________|________|__/  \\__/
    `,

    asciiTagline = `
     ___ ___  ___  ___  _   _  ___ _____ ___ ___  _  _
    | _ | _ \\/ _ \\|   \\| | | |/ __|_   _|_ _/ _ \\| \\| |
    |  _|   | (_) | |) | |_| | (__  | |  | | (_) | .\` |
    |_| |_|_\\\\___/|___/ \\___/ \\___| |_| |___\\___/|_|\\_|
    `,

    asciiTag = asciiTitle  + asciiTagline;

    console.log(asciiTag);
  }

  /**
   * Async Sleep Function
   *  Sleeps operations for a given time
   *
   * @param ms: Amount of time should sleep for.
   */
  async sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}
