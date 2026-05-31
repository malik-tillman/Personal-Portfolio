import { Injectable, Inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SanityService {
  private client: SanityClient;
  private builder: any;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.client = createClient({
      projectId: environment.sanity.projectId,
      dataset: environment.sanity.dataset,
      useCdn: environment.sanity.useCdn,
      apiVersion: environment.sanity.apiVersion,
    });

    this.builder = imageUrlBuilder(this.client);
  }

  /**
   * Generate a deterministic transfer state key from query + params
   */
  private getStateKey<T>(query: string, params: any) {
    const key = query + JSON.stringify(params);
    return makeStateKey<T>(key);
  }

  /**
   * Fetch data from Sanity using GROQ query
   * Uses TransferState to avoid re-fetching on the client after prerender.
   * @param query GROQ query string
   * @param params Optional query parameters
   */
  async fetch<T>(query: string, params = {}): Promise<T> {
    const stateKey = this.getStateKey<T>(query, params);

    // On the browser, check if prerendered data exists in TransferState
    if (this.isBrowser && this.transferState.hasKey(stateKey)) {
      const data = this.transferState.get(stateKey, null as unknown as T);
      return data;
    }

    // Fetch from Sanity (during prerender or if no cached data)
    const result = await this.client.fetch<T>(query, params);

    // On the server/prerender, store data in TransferState for the client
    if (!this.isBrowser) {
      this.transferState.set(stateKey, result);
    }

    return result;
  }

  /**
   * Generate Sanity image URL
   * In production, proxies the request through Netlify's Image CDN
   * @param source Sanity image source object
   */
  getImageUrl(source: any) {
    const rawBuilder = this.builder.image(source);

    class NetlifyImageBuilder {
      private _width?: number;
      private _height?: number;
      private _quality?: number;
      private _format?: string;

      constructor(private builderRef: any) {}

      width(w: number) {
        this._width = w;
        this.builderRef = this.builderRef.width(w);
        return this;
      }

      height(h: number) {
        this._height = h;
        this.builderRef = this.builderRef.height(h);
        return this;
      }

      quality(q: number) {
        this._quality = q;
        this.builderRef = this.builderRef.quality(q);
        return this;
      }

      auto(format: string) {
        this._format = format;
        this.builderRef = this.builderRef.auto(format);
        return this;
      }

      url(): string {
        const sanityUrl = this.builderRef.url();
        if (!sanityUrl) return '';

        if (!environment.production) {
          return sanityUrl;
        }

        // Parse and forward parameters to Netlify's Image CDN proxy
        const baseUrl = sanityUrl.split('?')[0];
        const params = new URLSearchParams();
        params.set('url', baseUrl);
        if (this._width) params.set('w', this._width.toString());
        if (this._height) params.set('h', this._height.toString());
        if (this._quality) params.set('q', this._quality.toString());
        if (this._format) params.set('fm', this._format === 'format' ? 'webp' : this._format);

        return `/.netlify/images?${params.toString()}`;
      }
    }

    return new NetlifyImageBuilder(rawBuilder);
  }

  /**
   * Get file URL for non-image assets
   * @param source Sanity file source object
   */
  getFileUrl(source: any): string {
    if (!source || !source.asset || !source.asset._ref) return '';
    // Format: file-assetid-extension
    const ref = source.asset._ref;
    const [_file, id, extension] = ref.split('-');
    return `https://cdn.sanity.io/files/${environment.sanity.projectId}/${environment.sanity.dataset}/${id}.${extension}`;
  }
}
