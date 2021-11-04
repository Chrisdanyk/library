import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBook, Book } from '../book.model';

import { BookService } from './book.service';

describe('Book Service', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let elemDefault: IBook;
  let expectedResult: IBook | IBook[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      isbn: 'AAAAAAA',
      name: 'AAAAAAA',
      publisherName: 'AAAAAAA',
      publisherUrl: 'AAAAAAA',
      publishYear: 'AAAAAAA',
      copies: 0,
      coverContentType: 'image/png',
      cover: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Book', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Book()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Book', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isbn: 'BBBBBB',
          name: 'BBBBBB',
          publisherName: 'BBBBBB',
          publisherUrl: 'BBBBBB',
          publishYear: 'BBBBBB',
          copies: 1,
          cover: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Book', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          publisherName: 'BBBBBB',
          publisherUrl: 'BBBBBB',
        },
        new Book()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Book', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          isbn: 'BBBBBB',
          name: 'BBBBBB',
          publisherName: 'BBBBBB',
          publisherUrl: 'BBBBBB',
          publishYear: 'BBBBBB',
          copies: 1,
          cover: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Book', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBookToCollectionIfMissing', () => {
      it('should add a Book to an empty array', () => {
        const book: IBook = { id: 123 };
        expectedResult = service.addBookToCollectionIfMissing([], book);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(book);
      });

      it('should not add a Book to an array that contains it', () => {
        const book: IBook = { id: 123 };
        const bookCollection: IBook[] = [
          {
            ...book,
          },
          { id: 456 },
        ];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, book);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Book to an array that doesn't contain it", () => {
        const book: IBook = { id: 123 };
        const bookCollection: IBook[] = [{ id: 456 }];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, book);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(book);
      });

      it('should add only unique Book to an array', () => {
        const bookArray: IBook[] = [{ id: 123 }, { id: 456 }, { id: 20703 }];
        const bookCollection: IBook[] = [{ id: 123 }];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, ...bookArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const book: IBook = { id: 123 };
        const book2: IBook = { id: 456 };
        expectedResult = service.addBookToCollectionIfMissing([], book, book2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(book);
        expect(expectedResult).toContain(book2);
      });

      it('should accept null and undefined values', () => {
        const book: IBook = { id: 123 };
        expectedResult = service.addBookToCollectionIfMissing([], null, book, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(book);
      });

      it('should return initial array if no Book is added', () => {
        const bookCollection: IBook[] = [{ id: 123 }];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, undefined, null);
        expect(expectedResult).toEqual(bookCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
