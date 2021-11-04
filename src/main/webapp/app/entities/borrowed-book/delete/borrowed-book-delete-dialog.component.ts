import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBorrowedBook } from '../borrowed-book.model';
import { BorrowedBookService } from '../service/borrowed-book.service';

@Component({
  templateUrl: './borrowed-book-delete-dialog.component.html',
})
export class BorrowedBookDeleteDialogComponent {
  borrowedBook?: IBorrowedBook;

  constructor(protected borrowedBookService: BorrowedBookService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.borrowedBookService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
