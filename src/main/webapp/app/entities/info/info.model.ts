import { IUser } from 'app/entities/user/user.model';

export interface IInfo {
  id?: number;
  address?: string | null;
  phone?: string | null;
  user?: IUser | null;
}

export class Info implements IInfo {
  constructor(public id?: number, public address?: string | null, public phone?: string | null, public user?: IUser | null) {}
}

export function getInfoIdentifier(info: IInfo): number | undefined {
  return info.id;
}
