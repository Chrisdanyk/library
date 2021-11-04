import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBook } from '../book.model';
import { BookService } from '../service/book.service';

@Component({
  templateUrl: './book-delete-dialog.component.html',
})
export class BookDeleteDialogComponent {
  book?: IBook;

  constructor(protected bookService: BookService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
