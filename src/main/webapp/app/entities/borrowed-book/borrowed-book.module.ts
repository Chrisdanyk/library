import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BorrowedBookComponent } from './list/borrowed-book.component';
import { BorrowedBookDetailComponent } from './detail/borrowed-book-detail.component';
import { BorrowedBookUpdateComponent } from './update/borrowed-book-update.component';
import { BorrowedBookDeleteDialogComponent } from './delete/borrowed-book-delete-dialog.component';
import { BorrowedBookRoutingModule } from './route/borrowed-book-routing.module';
import { BorrowedBookReturnDialogComponent } from './return/borrowed-book-return-dialog.component';

@NgModule({
  imports: [SharedModule, BorrowedBookRoutingModule],
  declarations: [
    BorrowedBookComponent,
    BorrowedBookDetailComponent,
    BorrowedBookUpdateComponent,
    BorrowedBookDeleteDialogComponent,
    BorrowedBookReturnDialogComponent,
  ],
  entryComponents: [BorrowedBookDeleteDialogComponent],
})
export class BorrowedBookModule {}
