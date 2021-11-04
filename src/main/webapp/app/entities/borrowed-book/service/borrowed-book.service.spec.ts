import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { IBorrowedBook, BorrowedBook } from '../borrowed-book.model';

import { BorrowedBookService } from './borrowed-book.service';

describe('BorrowedBook Service', () => {
  let service: BorrowedBookService;
  let httpMock: HttpTestingController;
  let elemDefault: IBorrowedBook;
  let expectedResult: IBorrowedBook | IBorrowedBook[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BorrowedBookService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      borrowDate: currentDate,
      returnDate: currentDate,
      status: Status.BORROWED,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          borrowDate: currentDate.format(DATE_FORMAT),
          returnDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BorrowedBook', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          borrowDate: currentDate.format(DATE_FORMAT),
          returnDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          borrowDate: currentDate,
          returnDate: currentDate,
        },
        returnedFromService
      );

      service.create(new BorrowedBook()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BorrowedBook', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          borrowDate: currentDate.format(DATE_FORMAT),
          returnDate: currentDate.format(DATE_FORMAT),
          status: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          borrowDate: currentDate,
          returnDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BorrowedBook', () => {
      const patchObject = Object.assign(
        {
          borrowDate: currentDate.format(DATE_FORMAT),
          returnDate: currentDate.format(DATE_FORMAT),
        },
        new BorrowedBook()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          borrowDate: currentDate,
          returnDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BorrowedBook', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          borrowDate: currentDate.format(DATE_FORMAT),
          returnDate: currentDate.format(DATE_FORMAT),
          status: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          borrowDate: currentDate,
          returnDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BorrowedBook', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBorrowedBookToCollectionIfMissing', () => {
      it('should add a BorrowedBook to an empty array', () => {
        const borrowedBook: IBorrowedBook = { id: 123 };
        expectedResult = service.addBorrowedBookToCollectionIfMissing([], borrowedBook);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(borrowedBook);
      });

      it('should not add a BorrowedBook to an array that contains it', () => {
        const borrowedBook: IBorrowedBook = { id: 123 };
        const borrowedBookCollection: IBorrowedBook[] = [
          {
            ...borrowedBook,
          },
          { id: 456 },
        ];
        expectedResult = service.addBorrowedBookToCollectionIfMissing(borrowedBookCollection, borrowedBook);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BorrowedBook to an array that doesn't contain it", () => {
        const borrowedBook: IBorrowedBook = { id: 123 };
        const borrowedBookCollection: IBorrowedBook[] = [{ id: 456 }];
        expectedResult = service.addBorrowedBookToCollectionIfMissing(borrowedBookCollection, borrowedBook);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(borrowedBook);
      });

      it('should add only unique BorrowedBook to an array', () => {
        const borrowedBookArray: IBorrowedBook[] = [{ id: 123 }, { id: 456 }, { id: 63349 }];
        const borrowedBookCollection: IBorrowedBook[] = [{ id: 123 }];
        expectedResult = service.addBorrowedBookToCollectionIfMissing(borrowedBookCollection, ...borrowedBookArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const borrowedBook: IBorrowedBook = { id: 123 };
        const borrowedBook2: IBorrowedBook = { id: 456 };
        expectedResult = service.addBorrowedBookToCollectionIfMissing([], borrowedBook, borrowedBook2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(borrowedBook);
        expect(expectedResult).toContain(borrowedBook2);
      });

      it('should accept null and undefined values', () => {
        const borrowedBook: IBorrowedBook = { id: 123 };
        expectedResult = service.addBorrowedBookToCollectionIfMissing([], null, borrowedBook, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(borrowedBook);
      });

      it('should return initial array if no BorrowedBook is added', () => {
        const borrowedBookCollection: IBorrowedBook[] = [{ id: 123 }];
        expectedResult = service.addBorrowedBookToCollectionIfMissing(borrowedBookCollection, undefined, null);
        expect(expectedResult).toEqual(borrowedBookCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
