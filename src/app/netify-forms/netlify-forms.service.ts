import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Contact } from '../contact-form/contact-form.component';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetlifyFormsService {
  constructor(private http: HttpClient) { }

  public submitEntry(inquiry: Contact): Observable<string> {
    const entry = new HttpParams({
      fromObject: {
        'form-name': 'contact',
        ...inquiry
      }
    });

    return this.http.post('/', entry.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      }
    ).pipe(catchError(this.handleError));

    // return this.__submitEntry__(entry);
  }

  private __submitEntry__(entry: HttpParams): Observable<string> {
    return this.http.post('/', entry.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text'
      }
    ).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errMsg = '';

    if (err.error instanceof ErrorEvent)
      errMsg = `A client-side error occurred: ${ err.error.message }`;

    else
      errMsg = `A server-side error occurred. Code: ${ err.status }. Message: ${ err.message }`;

    return throwError(errMsg);
  }
}
