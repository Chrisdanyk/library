import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInfo } from '../info.model';

@Component({
  selector: 'jhi-info-detail',
  templateUrl: './info-detail.component.html',
})
export class InfoDetailComponent implements OnInit {
  info: IInfo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ info }) => {
      this.info = info;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
