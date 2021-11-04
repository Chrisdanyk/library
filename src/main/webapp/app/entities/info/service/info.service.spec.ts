import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInfo, Info } from '../info.model';

import { InfoService } from './info.service';

describe('Info Service', () => {
  let service: InfoService;
  let httpMock: HttpTestingController;
  let elemDefault: IInfo;
  let expectedResult: IInfo | IInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InfoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      address: 'AAAAAAA',
      phone: 'AAAAAAA',
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

    it('should create a Info', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Info()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Info', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          address: 'BBBBBB',
          phone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Info', () => {
      const patchObject = Object.assign({}, new Info());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Info', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          address: 'BBBBBB',
          phone: 'BBBBBB',
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

    it('should delete a Info', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addInfoToCollectionIfMissing', () => {
      it('should add a Info to an empty array', () => {
        const info: IInfo = { id: 123 };
        expectedResult = service.addInfoToCollectionIfMissing([], info);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(info);
      });

      it('should not add a Info to an array that contains it', () => {
        const info: IInfo = { id: 123 };
        const infoCollection: IInfo[] = [
          {
            ...info,
          },
          { id: 456 },
        ];
        expectedResult = service.addInfoToCollectionIfMissing(infoCollection, info);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Info to an array that doesn't contain it", () => {
        const info: IInfo = { id: 123 };
        const infoCollection: IInfo[] = [{ id: 456 }];
        expectedResult = service.addInfoToCollectionIfMissing(infoCollection, info);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(info);
      });

      it('should add only unique Info to an array', () => {
        const infoArray: IInfo[] = [{ id: 123 }, { id: 456 }, { id: 94770 }];
        const infoCollection: IInfo[] = [{ id: 123 }];
        expectedResult = service.addInfoToCollectionIfMissing(infoCollection, ...infoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const info: IInfo = { id: 123 };
        const info2: IInfo = { id: 456 };
        expectedResult = service.addInfoToCollectionIfMissing([], info, info2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(info);
        expect(expectedResult).toContain(info2);
      });

      it('should accept null and undefined values', () => {
        const info: IInfo = { id: 123 };
        expectedResult = service.addInfoToCollectionIfMissing([], null, info, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(info);
      });

      it('should return initial array if no Info is added', () => {
        const infoCollection: IInfo[] = [{ id: 123 }];
        expectedResult = service.addInfoToCollectionIfMissing(infoCollection, undefined, null);
        expect(expectedResult).toEqual(infoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
