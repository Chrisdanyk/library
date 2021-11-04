import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'info',
        data: { pageTitle: 'libraryApp.info.home.title' },
        loadChildren: () => import('./info/info.module').then(m => m.InfoModule),
      },
      {
        path: 'book',
        data: { pageTitle: 'libraryApp.book.home.title' },
        loadChildren: () => import('./book/book.module').then(m => m.BookModule),
      },
      {
        path: 'borrowed-book',
        data: { pageTitle: 'libraryApp.borrowedBook.home.title' },
        loadChildren: () => import('./borrowed-book/borrowed-book.module').then(m => m.BorrowedBookModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
