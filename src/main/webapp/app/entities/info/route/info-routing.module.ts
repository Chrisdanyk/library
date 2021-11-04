import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InfoComponent } from '../list/info.component';
import { InfoDetailComponent } from '../detail/info-detail.component';
import { InfoUpdateComponent } from '../update/info-update.component';
import { InfoRoutingResolveService } from './info-routing-resolve.service';

const infoRoute: Routes = [
  {
    path: '',
    component: InfoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InfoDetailComponent,
    resolve: {
      info: InfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InfoUpdateComponent,
    resolve: {
      info: InfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InfoUpdateComponent,
    resolve: {
      info: InfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(infoRoute)],
  exports: [RouterModule],
})
export class InfoRoutingModule {}
