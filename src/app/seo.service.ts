/**
 * seo.service
 * @author Malik Tillman
 *
 * Centralizes all SEO concerns: <title>, <meta>, canonical, Open Graph, Twitter Card, and JSON-LD.
 */
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

export interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteUrl = environment.siteUrl;
  private readonly siteName = 'Malik Tillman';
  private readonly defaultImage = 'https://cdn.maliktillman.com/file/maliktillman-media-store/images/logo/aleek-logo_thumb.jpg';

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  update(config: SeoConfig): void {
    const fullTitle = config.title === this.siteName
      ? config.title
      : `${config.title} | ${this.siteName}`;
    const url = config.url || `${this.siteUrl}${this.router.url}`;
    const image = config.image || this.defaultImage;
    const type = config.type || 'website';

    // <title>
    this.titleService.setTitle(fullTitle);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical
    this.setCanonical(url);

    // JSON-LD
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement = this.doc.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.doc.head.appendChild(link);
    }
  }

  private setJsonLd(schema: Record<string, any>): void {
    // Remove any existing JSON-LD
    const existing = this.doc.querySelector('script[type="application/ld+json"]#seo-jsonld');
    if (existing) {
      existing.remove();
    }

    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'seo-jsonld');
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }
}
