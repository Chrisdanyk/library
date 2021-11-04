import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInfo } from '../info.model';
import { InfoService } from '../service/info.service';

@Component({
  templateUrl: './info-delete-dialog.component.html',
})
export class InfoDeleteDialogComponent {
  info?: IInfo;

  constructor(protected infoService: InfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.infoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
