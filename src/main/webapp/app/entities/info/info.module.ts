import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InfoComponent } from './list/info.component';
import { InfoDetailComponent } from './detail/info-detail.component';
import { InfoUpdateComponent } from './update/info-update.component';
import { InfoDeleteDialogComponent } from './delete/info-delete-dialog.component';
import { InfoRoutingModule } from './route/info-routing.module';

@NgModule({
  imports: [SharedModule, InfoRoutingModule],
  declarations: [InfoComponent, InfoDetailComponent, InfoUpdateComponent, InfoDeleteDialogComponent],
  entryComponents: [InfoDeleteDialogComponent],
})
export class InfoModule {}
