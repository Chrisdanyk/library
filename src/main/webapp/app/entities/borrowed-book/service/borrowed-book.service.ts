import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBorrowedBook, getBorrowedBookIdentifier } from '../borrowed-book.model';

export type EntityResponseType = HttpResponse<IBorrowedBook>;
export type EntityArrayResponseType = HttpResponse<IBorrowedBook[]>;

@Injectable({ providedIn: 'root' })
export class BorrowedBookService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/borrowed-books');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(borrowedBook: IBorrowedBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(borrowedBook);
    return this.http
      .post<IBorrowedBook>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(borrowedBook: IBorrowedBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(borrowedBook);
    return this.http
      .put<IBorrowedBook>(`${this.resourceUrl}/${getBorrowedBookIdentifier(borrowedBook) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(borrowedBook: IBorrowedBook): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(borrowedBook);
    return this.http
      .patch<IBorrowedBook>(`${this.resourceUrl}/${getBorrowedBookIdentifier(borrowedBook) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBorrowedBook>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBorrowedBook[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  returnBook(id: number): Observable<EntityResponseType> {
    // const copy = this.convertDateFromClient(borrowedBook);
    return this.http
      .get<any>(`${this.resourceUrl}/${id}/return`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  addBorrowedBookToCollectionIfMissing(
    borrowedBookCollection: IBorrowedBook[],
    ...borrowedBooksToCheck: (IBorrowedBook | null | undefined)[]
  ): IBorrowedBook[] {
    const borrowedBooks: IBorrowedBook[] = borrowedBooksToCheck.filter(isPresent);
    if (borrowedBooks.length > 0) {
      const borrowedBookCollectionIdentifiers = borrowedBookCollection.map(
        borrowedBookItem => getBorrowedBookIdentifier(borrowedBookItem)!
      );
      const borrowedBooksToAdd = borrowedBooks.filter(borrowedBookItem => {
        const borrowedBookIdentifier = getBorrowedBookIdentifier(borrowedBookItem);
        if (borrowedBookIdentifier == null || borrowedBookCollectionIdentifiers.includes(borrowedBookIdentifier)) {
          return false;
        }
        borrowedBookCollectionIdentifiers.push(borrowedBookIdentifier);
        return true;
      });
      return [...borrowedBooksToAdd, ...borrowedBookCollection];
    }
    return borrowedBookCollection;
  }

  protected convertDateFromClient(borrowedBook: IBorrowedBook): IBorrowedBook {
    return Object.assign({}, borrowedBook, {
      borrowDate: borrowedBook.borrowDate?.isValid() ? borrowedBook.borrowDate.format(DATE_FORMAT) : undefined,
      returnDate: borrowedBook.returnDate?.isValid() ? borrowedBook.returnDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.borrowDate = res.body.borrowDate ? dayjs(res.body.borrowDate) : undefined;
      res.body.returnDate = res.body.returnDate ? dayjs(res.body.returnDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((borrowedBook: IBorrowedBook) => {
        borrowedBook.borrowDate = borrowedBook.borrowDate ? dayjs(borrowedBook.borrowDate) : undefined;
        borrowedBook.returnDate = borrowedBook.returnDate ? dayjs(borrowedBook.returnDate) : undefined;
      });
    }
    return res;
  }
}
