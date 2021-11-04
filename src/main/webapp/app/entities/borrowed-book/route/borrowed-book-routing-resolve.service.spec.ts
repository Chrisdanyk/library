jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBorrowedBook, BorrowedBook } from '../borrowed-book.model';
import { BorrowedBookService } from '../service/borrowed-book.service';

import { BorrowedBookRoutingResolveService } from './borrowed-book-routing-resolve.service';

describe('BorrowedBook routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BorrowedBookRoutingResolveService;
  let service: BorrowedBookService;
  let resultBorrowedBook: IBorrowedBook | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(BorrowedBookRoutingResolveService);
    service = TestBed.inject(BorrowedBookService);
    resultBorrowedBook = undefined;
  });

  describe('resolve', () => {
    it('should return IBorrowedBook returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBorrowedBook = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBorrowedBook).toEqual({ id: 123 });
    });

    it('should return new IBorrowedBook if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBorrowedBook = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBorrowedBook).toEqual(new BorrowedBook());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BorrowedBook })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBorrowedBook = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBorrowedBook).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
