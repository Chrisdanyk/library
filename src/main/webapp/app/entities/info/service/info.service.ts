import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInfo, getInfoIdentifier } from '../info.model';

export type EntityResponseType = HttpResponse<IInfo>;
export type EntityArrayResponseType = HttpResponse<IInfo[]>;

@Injectable({ providedIn: 'root' })
export class InfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(info: IInfo): Observable<EntityResponseType> {
    return this.http.post<IInfo>(this.resourceUrl, info, { observe: 'response' });
  }

  update(info: IInfo): Observable<EntityResponseType> {
    return this.http.put<IInfo>(`${this.resourceUrl}/${getInfoIdentifier(info) as number}`, info, { observe: 'response' });
  }

  partialUpdate(info: IInfo): Observable<EntityResponseType> {
    return this.http.patch<IInfo>(`${this.resourceUrl}/${getInfoIdentifier(info) as number}`, info, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInfoToCollectionIfMissing(infoCollection: IInfo[], ...infosToCheck: (IInfo | null | undefined)[]): IInfo[] {
    const infos: IInfo[] = infosToCheck.filter(isPresent);
    if (infos.length > 0) {
      const infoCollectionIdentifiers = infoCollection.map(infoItem => getInfoIdentifier(infoItem)!);
      const infosToAdd = infos.filter(infoItem => {
        const infoIdentifier = getInfoIdentifier(infoItem);
        if (infoIdentifier == null || infoCollectionIdentifiers.includes(infoIdentifier)) {
          return false;
        }
        infoCollectionIdentifiers.push(infoIdentifier);
        return true;
      });
      return [...infosToAdd, ...infoCollection];
    }
    return infoCollection;
  }
}
