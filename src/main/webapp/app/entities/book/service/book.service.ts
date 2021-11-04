import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBook, getBookIdentifier } from '../book.model';

export type EntityResponseType = HttpResponse<IBook>;
export type EntityArrayResponseType = HttpResponse<IBook[]>;

@Injectable({ providedIn: 'root' })
export class BookService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/books');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(book: IBook): Observable<EntityResponseType> {
    return this.http.post<IBook>(this.resourceUrl, book, { observe: 'response' });
  }

  update(book: IBook): Observable<EntityResponseType> {
    return this.http.put<IBook>(`${this.resourceUrl}/${getBookIdentifier(book) as number}`, book, { observe: 'response' });
  }

  partialUpdate(book: IBook): Observable<EntityResponseType> {
    return this.http.patch<IBook>(`${this.resourceUrl}/${getBookIdentifier(book) as number}`, book, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBook>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBook[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBookToCollectionIfMissing(bookCollection: IBook[], ...booksToCheck: (IBook | null | undefined)[]): IBook[] {
    const books: IBook[] = booksToCheck.filter(isPresent);
    if (books.length > 0) {
      const bookCollectionIdentifiers = bookCollection.map(bookItem => getBookIdentifier(bookItem)!);
      const booksToAdd = books.filter(bookItem => {
        const bookIdentifier = getBookIdentifier(bookItem);
        if (bookIdentifier == null || bookCollectionIdentifiers.includes(bookIdentifier)) {
          return false;
        }
        bookCollectionIdentifiers.push(bookIdentifier);
        return true;
      });
      return [...booksToAdd, ...bookCollection];
    }
    return bookCollection;
  }
}
