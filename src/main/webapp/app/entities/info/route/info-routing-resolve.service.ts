import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInfo, Info } from '../info.model';
import { InfoService } from '../service/info.service';

@Injectable({ providedIn: 'root' })
export class InfoRoutingResolveService implements Resolve<IInfo> {
  constructor(protected service: InfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((info: HttpResponse<Info>) => {
          if (info.body) {
            return of(info.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Info());
  }
}
