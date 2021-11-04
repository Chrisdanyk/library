import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BorrowedBookComponent } from './list/borrowed-book.component';
import { BorrowedBookDetailComponent } from './detail/borrowed-book-detail.component';
import { BorrowedBookUpdateComponent } from './update/borrowed-book-update.component';
import { BorrowedBookDeleteDialogComponent } from './delete/borrowed-book-delete-dialog.component';
import { BorrowedBookRoutingModule } from './route/borrowed-book-routing.module';

@NgModule({
  imports: [SharedModule, BorrowedBookRoutingModule],
  declarations: [BorrowedBookComponent, BorrowedBookDetailComponent, BorrowedBookUpdateComponent, BorrowedBookDeleteDialogComponent],
  entryComponents: [BorrowedBookDeleteDialogComponent],
})
export class BorrowedBookModule {}
