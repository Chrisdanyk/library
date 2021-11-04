import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBorrowedBook, BorrowedBook } from '../borrowed-book.model';
import { BorrowedBookService } from '../service/borrowed-book.service';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-borrowed-book-update',
  templateUrl: './borrowed-book-update.component.html',
})
export class BorrowedBookUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  booksCollection: IBook[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    borrowDate: [],
    returnDate: [],
    status: [null, [Validators.required]],
    book: [],
    client: [],
  });

  constructor(
    protected borrowedBookService: BorrowedBookService,
    protected bookService: BookService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ borrowedBook }) => {
      this.updateForm(borrowedBook);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const borrowedBook = this.createFromForm();
    if (borrowedBook.id !== undefined) {
      this.subscribeToSaveResponse(this.borrowedBookService.update(borrowedBook));
    } else {
      this.subscribeToSaveResponse(this.borrowedBookService.create(borrowedBook));
    }
  }

  trackBookById(index: number, item: IBook): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBorrowedBook>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(borrowedBook: IBorrowedBook): void {
    this.editForm.patchValue({
      id: borrowedBook.id,
      borrowDate: borrowedBook.borrowDate,
      returnDate: borrowedBook.returnDate,
      status: borrowedBook.status,
      book: borrowedBook.book,
      client: borrowedBook.client,
    });

    this.booksCollection = this.bookService.addBookToCollectionIfMissing(this.booksCollection, borrowedBook.book);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, borrowedBook.client);
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query({ filter: 'borrowedbook-is-null' })
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing(books, this.editForm.get('book')!.value)))
      .subscribe((books: IBook[]) => (this.booksCollection = books));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('client')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IBorrowedBook {
    return {
      ...new BorrowedBook(),
      id: this.editForm.get(['id'])!.value,
      borrowDate: this.editForm.get(['borrowDate'])!.value,
      returnDate: this.editForm.get(['returnDate'])!.value,
      status: this.editForm.get(['status'])!.value,
      book: this.editForm.get(['book'])!.value,
      client: this.editForm.get(['client'])!.value,
    };
  }
}
