/**
 * fetch-works.service
 * @author Malik Tillman
 *
 * 2020
 * */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Determine environment */
const production:boolean = true;

@Injectable({providedIn: 'root'})
export class FetchWorksService {
  /* Main API endpoint */
  private hostUrl:string = 'api.maliktillman.com';

  /* Cache */
  private _worksListCache:MetaProject[] = [];
  private _projectsCache:Project[] = [];

  /* List of cached ids */
  public cachedIDs = [];

  /* List of cached types */
  public cachedMetaTypes = [];

  /* Records if works list is fully cached */
  private _isWorksListCached = false;

  constructor(private http:HttpClient) {}

  /**
   * GetWorksList
   * Resolves full work list.
   * */
  getWorksList() {
    return new Promise(resolve => {
      /* Resolve cached data */
      if(this._isWorksListCached)
        resolve(this._worksListCache);

      /* Fetch data and cache */
      else
        this.http.get<MetaProject[]>(`https://${ this.hostUrl }/work-list`)
          .subscribe((data:MetaProject[]) => {
            /* Cache data */
            this._worksListCache = data;
            this._isWorksListCached = true;

            /* Return data */
            resolve(data);
          });
    })
  }

  /**
   * GetProject
   * Returns project data, querying using specified ID
   * */
  getProject( id:number ) {
    return new Promise( resolve => {
      /* Check if project is cached */
      if(this.cachedIDs.includes(id))
        /* Return cached data */
        resolve(this._projectsCache.find(project => project.id == id))

      else {
        /* Add project id to cached list */
        this.cachedIDs.push(id);

        /* Fetch data */
        this.http.get(`https://${ this.hostUrl }/works/${ id }`).subscribe((data:Project) => {
          /* Add project to cache */
          this._projectsCache.push(data);

          /* Return data */
          resolve(data);
        });
      }
    })
  }

  /**
   * GetWorksListByType
   * Resolves work's meta data by type
   * */
  getWorksListByType( types:string[] ) {
    return new Promise(resolve => {
      /* Types that have not been cached */
      let queryTypes = [];

      if(!this._isWorksListCached) {
        /* Add to cached list */
        types.forEach(type => {
          if(!this.cachedMetaTypes.includes(type)) {
            this.cachedMetaTypes.push(type);
            queryTypes.push(type);
          }
        })
      }

      /* Query uncached types */
      if(queryTypes.length > 0) {
        /* Fetch data */
        this.http.get<MetaProject[]>(`https://${ this.hostUrl }/work-list/${ queryTypes.join(',') }`)
          .subscribe((data:MetaProject[]) => {
            /* Push data to cache */
            data.forEach(metaProject => {
              this._worksListCache.push(metaProject);
            })

            /* Return Data */
            resolve(this._worksListCache.filter(metaWork => types.includes(metaWork.category)));
          })
      }
      else
        /* Return cached data */
        resolve(this._worksListCache.filter(metaWork => types.includes(metaWork.category)));
    })
  }

  /**
   * GetWorksListByIDs
   * Resolves work's list by ID
   * No caching
   * */
  getWorksListByIds = ( ids:number[] ) => {
    return new Promise(resolve => {
      this.http.get<MetaProject[]>(`https://${ this.hostUrl }/work-list_by-ids/${ ids.join(',') }`)
        .subscribe((data:MetaProject[]) => {
          resolve(data);
        })
    })
  }
}

/**
 * Project Model
 * Defines model for project data
 * */
export interface Project {
  id: number,
  hidden: boolean,
  name: string,
  category: string,
  tags: string,
  description: string,
  thumbnail: string,
  images: string,
  videos: string,
  github: string,
  behance: string,
  website: string,
  date: string
}

/**
 * MetaProject Model
 * Defines a metadata model for projects, excludes data such as images, videos, and descriptions
 * */
export interface MetaProject {
  id: number,
  hidden: boolean,
  name: string,
  category: string,
  tags: string,
  thumbnail: string,
  github: string,
  behance: string,
  website: string
}

/**
 * FavoritesID
 * Showcase project IDs
 * */
export const FavoritesId:number[] = [ 1,2,3,4,5 ];

/**
 * Dynamic CDN
 * CDN url must change depending on environment website will be in
 * */
export const CDN = production ?
  'cdn.maliktillman.com/file/maliktillman-media-store' :
  'maliktillman-media-store.s3.us-west-002.backblazeb2.com';
