/**
 * projects.service
 * @author Malik Tillman
 *
 * 2020 - Migrated to Sanity 2026
 * */
import { Injectable } from '@angular/core';
import { SanityService } from './sanity.service';

@Injectable({providedIn: 'root'})
export class CMSService {
  /**
   * Default project IDs, used for quick showcase
   * */
  public readonly DEFAULTS = [1, 22, 23, 4];

  private _about: string[];
  private _quotes: _FormattedQuote[];
  private _errorMedia: _File[];
  private _successMedia: _File[];

  constructor(private sanity: SanityService) {}

  /**
   * Helper to format Sanity project data to ProjectAttributes interface
   */
  private __formatSanityProject__(sanityProject: any, processCollections: boolean = false): ProjectAttributes {
    const rawId = sanityProject._id.replace('project-', '');
    const numericId = parseInt(rawId);

    const project: ProjectAttributes = {
      title: sanityProject.title,
      date: sanityProject.year || sanityProject.publishedAt, // Use the new year field, fallback to published date
      description: sanityProject.description,
      category: sanityProject.categories ? sanityProject.categories[0] : '',
      tags: sanityProject.tags || '',
      github: sanityProject.github || '',
      website: sanityProject.website || '',
      createdAt: sanityProject._createdAt || sanityProject.publishedAt,
      updatedAd: sanityProject._updatedAt || sanityProject.publishedAt,
      id: isNaN(numericId) ? rawId : numericId,
      fromSanity: true
    };

    if (sanityProject.mainImage) {
      project.thumbnail_src = {
        url: this.sanity.getImageUrl(sanityProject.mainImage).width(1920).height(1080).quality(100).auto('format').url(),
        alt: sanityProject.title,
        id: 0
      };
    }

    if (processCollections) {
       project.image_src = (sanityProject.gallery || []).map(img => ({
         url: this.sanity.getImageUrl(img).width(1200).quality(85).auto('format').url(),
         alt: project.title,
         id: 0
       }));
       project.video_src = (sanityProject.videos || []).map(vid => ({
         url: this.sanity.getFileUrl(vid),
         alt: project.title,
         id: 0
       }));
    }

    return project;
  }

  /**
   * Returns project data by ID
   * */
  public async fetchProject(id: number | string): Promise<ProjectAttributes> {
    try {
      const sanityId = typeof id === 'number' ? `project-${id}` : id;
      const data = await this.sanity.fetch<any>(`*[_type == "project" && _id == $id][0]`, { id: sanityId });
      if (data) {
        return this.__formatSanityProject__(data, true);
      }
    } catch (error) {
      console.error('Sanity fetchProject error:', error);
    }
    return null;
  }

  /**
   * Resolves full work list.
   * */
  public async fetchList(): Promise<ProjectAttributes[]> {
    try {
      const sanityData = await this.sanity.fetch<any[]>('*[_type == "project"] | order(publishedAt desc)');
      if (sanityData) {
        return sanityData.map(sp => this.__formatSanityProject__(sp));
      }
    } catch (error) {
      console.error('Sanity fetchList error:', error);
    }
    return [];
  }

  /**
   * Resolves work's list by ID
   * */
  public async fetchListByID(ids: (number | string)[] = this.DEFAULTS): Promise<ProjectAttributes[]> {
    try {
      const sanityIds = ids.map(id => typeof id === 'number' ? `project-${id}` : id);
      const sanityData = await this.sanity.fetch<any[]>(`*[_type == "project" && _id in $ids]`, { ids: sanityIds });

      if (sanityData) {
        // Maintain order of requested IDs
        return ids.map(id => {
          const sanityId = typeof id === 'number' ? `project-${id}` : id;
          const project = sanityData.find(p => p._id === sanityId);
          return project ? this.__formatSanityProject__(project) : null;
        }).filter(p => p !== null);
      }
    } catch (error) {
      console.error('Sanity fetchListByID error:', error);
    }
    return [];
  }

  public async fetchCaseStudiesList(): Promise<any[]> {
    try {
      const sanityData = await this.sanity.fetch<any[]>('*[_type == "caseStudy"] | order(_createdAt desc)');
      if (sanityData) {
        return sanityData.map(study => {
          if (study.heroImage) {
             study.heroImage = this.sanity.getImageUrl(study.heroImage).width(800).quality(80).auto('format').url();
          }
          return study;
        });
      }
    } catch (error) {
      console.error('Sanity fetchCaseStudiesList error:', error);
    }
    return [];
  }

  public async fetchCaseStudy(slug: string): Promise<any> {
    try {
      const data = await this.sanity.fetch<any>(`*[_type == "caseStudy" && slug.current == $slug][0]`, { slug });
      if (data && data.heroImage) {
         data.heroImage = this.sanity.getImageUrl(data.heroImage).width(1200).quality(85).auto('format').url();
      }
      return data;
    } catch (error) {
      console.error('Sanity fetchCaseStudy error:', error);
    }
    return null;
  }

  public urlFor(source: any) {
    return this.sanity.getImageUrl(source);
  }

  public async fetchAbout(): Promise<string[]> {
    if (this._about) return this._about;

    try {
      const data = await this.sanity.fetch<any>('*[_type == "siteSettings"][0]{about}');
      if (data && data.about) {
        this._about = data.about.split("\n").filter(_p => _p !== "");
        return this._about;
      }
    } catch (error) {
      console.error('Sanity fetchAbout error:', error);
    }
    return [];
  }

  public async fetchQuotes(): Promise<_FormattedQuote[]> {
    if (this._quotes) return this._quotes;

    try {
      const data = await this.sanity.fetch<any[]>('*[_type == "quote"]{text, author}');
      if (data) {
        this._quotes = data.map(quote => ({
          text: quote.text,
          author: quote.author
        }));
        return this._quotes;
      }
    } catch (error) {
      console.error('Sanity fetchQuotes error:', error);
    }
    return [];
  }

  public async fetchSuccessMedia(): Promise<_File[]> {
    if (this._successMedia) return this._successMedia;

    try {
      const data = await this.sanity.fetch<any>('*[_type == "siteSettings"][0]{successMedia}');
      if (data && data.successMedia) {
        this._successMedia = data.successMedia.map(item => ({
          url: this.sanity.getImageUrl(item).url(),
          alt: 'Success Media',
          id: 0
        }));
        return this._successMedia;
      }
    } catch (error) {
      console.error('Sanity fetchSuccessMedia error:', error);
    }
    return [];
  }

  public async fetchErrorMedia(): Promise<_File[]> {
    if (this._errorMedia) return this._errorMedia;

    try {
      const data = await this.sanity.fetch<any>('*[_type == "siteSettings"][0]{errorMedia}');
      if (data && data.errorMedia) {
        this._errorMedia = data.errorMedia.map(item => ({
          url: this.sanity.getImageUrl(item).url(),
          alt: 'Error Media',
          id: 0
        }));
        return this._errorMedia;
      }
    } catch (error) {
      console.error('Sanity fetchErrorMedia error:', error);
    }
    return [];
  }
}

/**
 * Individual project data
 * */
export interface ProjectAttributes {
  title: string,
  date: string,
  description: string,
  category: string,
  tags: string,
  github: string,
  website: string,
  createdAt: string,
  updatedAd: string,

  id?: number | string,
  fromSanity?: boolean,
  thumbnail_src?: _File
  image_src?: _File[],
  video_src?: _File[]
}

export interface _File {
  url: string,
  alt: string,
  caption?: string,
  id?: number
}

interface _FormattedQuote {
  "text": string,
  "author"?: string
}



