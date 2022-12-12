/**
 * projects.service
 * @author Malik Tillman
 *
 * 2020
 * */
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../environments/environment';
import quote from 'ajv/dist/runtime/quote';

@Injectable({providedIn: 'root'})
export class CMSService {
  /**
   * Default project IDs, can be used for quick showcase of project
   *
   * todo: Make dynamic based on recency.
   * */
  public readonly DEFAULTS = [1,2,3,4];

  /**
   * Dynamic CDN based on environment
   * */
  private readonly CDN = environment.production ?
    'cdn.maliktillman.com/file/maliktillman-cms-light' :
    'maliktillman-cms-light.s3.us-west-002.backblazeb2.com';

  private api_projects: string = environment.production ?
    'https://cms.maliktillman.com/api/projects' :
    'http://localhost:5000/api/projects';

  private api_site: string = environment.production ?
    'https://cms.maliktillman.com/api/site-setting' :
    'http://localhost:5000/api/site-setting';

  private api_quotes: string = environment.production ?
    'https://cms.maliktillman.com/api/quotes' :
    'http://localhost:5000/api/quotes';

  private backup_quotes: _FormattedQuote[] = [
    { text: 'Welcome to MalikTillman.com!' },
    { text: "What's science to a man that can't apply it?", author: 'Roc Marciano' },
    { text: 'This site was designed and developed by Malik Tillman' },
    { text: 'A Leek Production' }
  ]

  private backup_about = ['I\'m a 24 year old full-stack developer, graphic designer, and technical expert based in the NJ and greater NYC area. I strive to craft meaningful digital experiences and enable life-changing creative concepts through the mediums of web development, mobile app development, and photography. I am proficient in a plethora of programming languages, frameworks, and design software, but my best trait as a professional is my ability to adapt to any problem and rise to the occasion. My ability to apply core technical and design methodologies to a range of conditions allow me to effectively craft industry standard digital experiences.'];

  private _ids: number[] = [];
  private _projects: Project[] = [];
  private _about: string[];
  private _quotes: _FormattedQuote[];
  private _errorMedia: _File[];
  private _successMedia: _File[];

  constructor(private http: HttpClient) {}

  /**
   * Returns project data, querying using specified ID
   * */
  public fetchProject(id: number): Promise<ProjectAttributes> {
    return new Promise( resolve => {
      if(this._ids.includes(id))
        return resolve(
          this.__formatSingle__(this._projects.find((project: Project) => project.id === id), true)
        );

      this.http.get(`${ this.api_projects }/${ id }?populate=%2A`).subscribe(
        (strapi: SingularStrapi) => {
          this._projects.push(strapi.data);
          this._ids.push(strapi.data.id);

          resolve(
            this.__formatSingle__(strapi.data, true)
          );
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);

          resolve(null);
        }
      );

      this.__fetchAll__().then();
    })
  }

  /**
   * Resolves full work list.
   * */
  public fetchList(): Promise<ProjectAttributes[]> {
    return new Promise(resolve => {
      if(this._projects.length > 0)
        return resolve(
          this.__formatList__(this._projects)
        );

      this.__fetchAll__()
        .then((_projects: Project[]) => {
          resolve(
            this.__formatList__(_projects)
          );
        })
    })
  }

  /**
   * Resolves work's list by ID
   * */
  public fetchListByID(ids: number[] = this.DEFAULTS): Promise<ProjectAttributes[]> {
    return new Promise(resolve => {
      // Check cache
      if(this._projects.length > 0)
        return resolve(
          this.__formatList__( this._projects.filter(project => ids.includes(project.id)), false )
        );

      // Fetch
      this.__fetchAll__()
        .then((_projects: Project[]) => {
          resolve(
            this.__formatList__( _projects.filter(project => ids.includes(project.id)), false )
          );
      });
    })
  }

  public fetchAbout(): Promise<string[]> {
    return new Promise(resolve => {
      if (this._about)
        return resolve(this._about);

      this.http.get(`${ this.api_site }?fields[0]=about`).subscribe((strapi: About) => {
        this._about = strapi.data.attributes.about.split("\n").filter(_p => _p !== "");
        resolve(this._about);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);

        resolve(this.backup_about);
      })
    })
  }

  public fetchQuotes(): Promise<_FormattedQuote[]> {
    return new Promise(resolve => {
      if (this._quotes)
        return resolve(this._quotes);

      this.http.get(`${this.api_quotes}?populate=%2A`).subscribe(
        (strapi: QuoteMetaData) => {
          this._quotes = strapi.data.map((quote: Quote) => {
            return {
              text: quote.attributes.text,
              author: quote.attributes.author
            };
          });
          resolve(this._quotes);
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);

          resolve(this.backup_quotes);
        }
      );
    })
  }

  public fetchSuccessMedia(): Promise<_File[]> {
    return new Promise(resolve => {
      if (this._successMedia)
        return resolve(this._successMedia)

      this.http.get(`${ this.api_site }?populate=%2A`).subscribe((strapi: SingleTypeStrapi) => {
        this._successMedia = this.__generateFileSources__(strapi.data.attributes.success_media);
        return  resolve(this._successMedia);
      },(error: HttpErrorResponse) => {
        console.log(error.message);

        resolve(null);
      })
    })
  }

  public fetchErrorMedia(): Promise<_File[]> {
    return new Promise(resolve => {
      if (this._errorMedia)
        return resolve(this._errorMedia)

      this.http.get(`${ this.api_site }?populate=%2A`).subscribe((strapi: SingleTypeStrapi) => {
        this._errorMedia = this.__generateFileSources__(strapi.data.attributes.error_media);
        return  resolve(this._errorMedia);
      },(error: HttpErrorResponse) => {
        console.log(error.message);

        resolve(null);
      })
    })
  }

  private __fetchAll__ = (): Promise<Project[]> => {
    return new Promise( resolve => {
      this.http.get(`${ this.api_projects }?populate=%2A`).subscribe((strapi: PluralStrapi) => {
        this._projects = strapi.data;
        this._projects.forEach(_project => {
          this._ids.push(_project.id)
        })

        resolve(strapi.data);
      }, (error: HttpErrorResponse) => {
        console.log(error.message);

        resolve([]);
      })
    })
  }

  private __formatList__(projects: Project[], processCollections: boolean = false): ProjectAttributes[] {
    return projects.map((project: Project) => this.__formatSingle__(project, processCollections))
  }

  private __formatSingle__(project: Project, processCollections: boolean = false): ProjectAttributes {
    let _formatted = project.attributes;

    _formatted.id = project.id;

    _formatted.thumbnail_src = this.__generateFileSource__(project.attributes.thumbnail.data);

    if (processCollections) {
      _formatted.image_src = this.__generateFileSources__(project.attributes.images);

      _formatted.video_src = this.__generateFileSources__(project.attributes.videos);
    }

    return _formatted;
  }

  private __generateFileSource__(_file: StrapiFileMetaData): _File {
    return {
      url: `https://${ this.CDN }/${ _file.attributes.hash }${ _file.attributes.ext }`,
      alt: _file.attributes.alternativeText,
      id: _file.id
    }
  }

  private __generateFileSources__(_files: StrapiFileCollection): _File[] {
    return _files.data?.map((_file: StrapiFileMetaData) => this.__generateFileSource__(_file));
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
  thumbnail: StrapiFile,
  images: StrapiFileCollection,
  videos: StrapiFileCollection,
  github: string,
  website: string,
  createdAt: string,
  updatedAd: string,

  id?: number,
  thumbnail_src?: _File
  image_src?: _File[],
  video_src?: _File[]
}

interface Project {
  id: number,
  attributes: ProjectAttributes
}

interface PluralStrapi {
  "data": Project[],
  "meta": object
}

interface SingularStrapi {
  "data": Project,
  "meta": object
}

interface SingleTypeStrapi {
  data: {
    "id": number,
    "attributes": {
      "about": string,
      error_media?: StrapiFileCollection,
      success_media?: StrapiFileCollection,
    }
  },
  meta: {}
}

interface StrapiFile {
  data: StrapiFileMetaData
}

interface StrapiFileCollection {
  data: StrapiFileMetaData[]
}

interface StrapiFileMetaData {
  id: number,
  attributes: {
    hash: string,
    ext: string,
    alternativeText: string
  }
}

export interface _File {
  url: string,
  alt: string,
  caption?: string,
  id?: number
}

interface About {
  data: {
    "id": number,
    "attributes": {
      "about": string
    }
  }
}

interface QuoteMetaData {
  data: Quote[],
  "meta": {
    "pagination": object
  }
}

interface Quote {
  "id": 1,
  "attributes": {
    "text": string,
    "author": string
  }
}

interface _FormattedQuote {
  "text": string,
  "author"?: string
}



