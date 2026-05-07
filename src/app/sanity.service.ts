import { Injectable } from '@angular/core';
import { createClient, SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SanityService {
  private client: SanityClient;
  private builder: any;

  constructor() {
    this.client = createClient({
      projectId: environment.sanity.projectId,
      dataset: environment.sanity.dataset,
      useCdn: environment.sanity.useCdn,
      apiVersion: environment.sanity.apiVersion,
    });

    this.builder = imageUrlBuilder(this.client);
  }

  /**
   * Fetch data from Sanity using GROQ query
   * @param query GROQ query string
   * @param params Optional query parameters
   */
  async fetch<T>(query: string, params = {}): Promise<T> {
    return await this.client.fetch<T>(query, params);
  }

  /**
   * Generate Sanity image URL
   * @param source Sanity image source object
   */
  getImageUrl(source: any) {
    return this.builder.image(source);
  }
}
