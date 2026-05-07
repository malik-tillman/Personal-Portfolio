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
