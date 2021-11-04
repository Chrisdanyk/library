import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BookComponent } from './list/book.component';
import { BookDetailComponent } from './detail/book-detail.component';
import { BookUpdateComponent } from './update/book-update.component';
import { BookDeleteDialogComponent } from './delete/book-delete-dialog.component';
import { BookRoutingModule } from './route/book-routing.module';

@NgModule({
  imports: [SharedModule, BookRoutingModule],
  declarations: [BookComponent, BookDetailComponent, BookUpdateComponent, BookDeleteDialogComponent],
  entryComponents: [BookDeleteDialogComponent],
})
export class BookModule {}
