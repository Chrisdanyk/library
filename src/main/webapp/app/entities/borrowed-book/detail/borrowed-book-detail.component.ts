import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBorrowedBook } from '../borrowed-book.model';

@Component({
  selector: 'jhi-borrowed-book-detail',
  templateUrl: './borrowed-book-detail.component.html',
})
export class BorrowedBookDetailComponent implements OnInit {
  borrowedBook: IBorrowedBook | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ borrowedBook }) => {
      this.borrowedBook = borrowedBook;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
