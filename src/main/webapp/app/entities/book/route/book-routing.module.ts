import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookComponent } from '../list/book.component';
import { BookDetailComponent } from '../detail/book-detail.component';
import { BookUpdateComponent } from '../update/book-update.component';
import { BookRoutingResolveService } from './book-routing-resolve.service';
import { BorrowedBookComponent } from '../../borrowed-book/list/borrowed-book.component';
import { BorrowComponent } from '../../../layouts/borrow/borrow.component';
import { BorrowedBookRoutingResolveService } from '../../borrowed-book/route/borrowed-book-routing-resolve.service';
import { BorrowedBookRoutingResolveBookService } from '../../borrowed-book/route/borrowed-book-routing-resolve.service-book';

const bookRoute: Routes = [
  {
    path: '',
    component: BookComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookDetailComponent,
    resolve: {
      book: BookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookUpdateComponent,
    resolve: {
      book: BookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookUpdateComponent,
    resolve: {
      book: BookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/borrow',
    component: BorrowComponent,
    resolve: {
      book: BookRoutingResolveService,
      borrowedBook: BorrowedBookRoutingResolveBookService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookRoute)],
  exports: [RouterModule],
})
export class BookRoutingModule {}
