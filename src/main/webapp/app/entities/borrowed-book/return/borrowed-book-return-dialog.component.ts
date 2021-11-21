import { Component, OnInit } from '@angular/core';
import { IBorrowedBook } from '../borrowed-book.model';
import { BorrowedBookService } from '../service/borrowed-book.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  // selector: 'jhi-borrowed-book-return-dialog',
  templateUrl: './borrowed-book-return-dialog.component.html',
  // styleUrls: ['./borrowed-book-return-dialog.component.scss']
})
export class BorrowedBookReturnDialogComponent {
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

  confirmReturn(id: number): void {
    this.borrowedBookService.returnBook(id).subscribe(() => {
      this.activeModal.close('returned');
    });
  }
}
