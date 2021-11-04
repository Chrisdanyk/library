import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BorrowedBookComponent } from '../list/borrowed-book.component';
import { BorrowedBookDetailComponent } from '../detail/borrowed-book-detail.component';
import { BorrowedBookUpdateComponent } from '../update/borrowed-book-update.component';
import { BorrowedBookRoutingResolveService } from './borrowed-book-routing-resolve.service';

const borrowedBookRoute: Routes = [
  {
    path: '',
    component: BorrowedBookComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BorrowedBookDetailComponent,
    resolve: {
      borrowedBook: BorrowedBookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BorrowedBookUpdateComponent,
    resolve: {
      borrowedBook: BorrowedBookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BorrowedBookUpdateComponent,
    resolve: {
      borrowedBook: BorrowedBookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(borrowedBookRoute)],
  exports: [RouterModule],
})
export class BorrowedBookRoutingModule {}
