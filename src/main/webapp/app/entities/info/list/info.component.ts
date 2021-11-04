import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInfo } from '../info.model';
import { InfoService } from '../service/info.service';
import { InfoDeleteDialogComponent } from '../delete/info-delete-dialog.component';

@Component({
  selector: 'jhi-info',
  templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {
  infos?: IInfo[];
  isLoading = false;

  constructor(protected infoService: InfoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.infoService.query().subscribe(
      (res: HttpResponse<IInfo[]>) => {
        this.isLoading = false;
        this.infos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInfo): number {
    return item.id!;
  }

  delete(info: IInfo): void {
    const modalRef = this.modalService.open(InfoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.info = info;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
