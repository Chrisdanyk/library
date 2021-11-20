jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BorrowedBookService } from '../service/borrowed-book.service';
import { IBorrowedBook, BorrowedBook } from '../borrowed-book.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { BorrowedBookUpdateComponent } from './borrowed-book-update.component';

describe('BorrowedBook Management Update Component', () => {
  let comp: BorrowedBookUpdateComponent;
  let fixture: ComponentFixture<BorrowedBookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let borrowedBookService: BorrowedBookService;
  let bookService: BookService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BorrowedBookUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(BorrowedBookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BorrowedBookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    borrowedBookService = TestBed.inject(BorrowedBookService);
    bookService = TestBed.inject(BookService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call book query and add missing value', () => {
      const borrowedBook: IBorrowedBook = { id: 456 };
      const book: IBook = { id: 84515 };
      borrowedBook.book = book;

      const bookCollection: IBook[] = [{ id: 52291 }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const expectedCollection: IBook[] = [book, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();
      // @ts-ignore
      expect(bookService.query).toHaveBeenCalled();
      // @ts-ignore
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(bookCollection, book);
      // @ts-ignore
      expect(comp.booksCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const borrowedBook: IBorrowedBook = { id: 456 };
      const client: IUser = { id: 99182 };
      borrowedBook.client = client;

      const userCollection: IUser[] = [{ id: 30857 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [client];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // @ts-ignore
      expect(userService.query).toHaveBeenCalled();
      // @ts-ignore
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      // @ts-ignore
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const borrowedBook: IBorrowedBook = { id: 456 };
      const book: IBook = { id: 9513 };
      borrowedBook.book = book;
      const client: IUser = { id: 18494 };
      borrowedBook.client = client;

      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();
      // @ts-ignore
      expect(comp.editForm.value).toEqual(expect.objectContaining(borrowedBook));
      // @ts-ignore
      expect(comp.booksCollection).toContain(book);
      // @ts-ignore
      expect(comp.usersSharedCollection).toContain(client);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BorrowedBook>>();
      const borrowedBook = { id: 123 };
      jest.spyOn(borrowedBookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      // @ts-ignore
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: borrowedBook }));
      saveSubject.complete();

      // THEN
      // @ts-ignore
      expect(comp.previousState).toHaveBeenCalled();
      // @ts-ignore
      expect(borrowedBookService.update).toHaveBeenCalledWith(borrowedBook);
      // @ts-ignore
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BorrowedBook>>();
      const borrowedBook = new BorrowedBook();
      jest.spyOn(borrowedBookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      // @ts-ignore
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: borrowedBook }));
      saveSubject.complete();

      // THEN
      // @ts-ignore
      expect(borrowedBookService.create).toHaveBeenCalledWith(borrowedBook);
      // @ts-ignore
      expect(comp.isSaving).toEqual(false);
      // @ts-ignore
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BorrowedBook>>();
      const borrowedBook = { id: 123 };
      jest.spyOn(borrowedBookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      // @ts-ignore
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      // @ts-ignore
      expect(borrowedBookService.update).toHaveBeenCalledWith(borrowedBook);
      // @ts-ignore
      expect(comp.isSaving).toEqual(false);
      // @ts-ignore
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBookById', () => {
      it('Should return tracked Book primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBookById(0, entity);
        // @ts-ignore
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        // @ts-ignore
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
