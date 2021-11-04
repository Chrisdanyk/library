import { IUser } from 'app/entities/user/user.model';

export interface IBook {
  id?: number;
  isbn?: string;
  name?: string;
  publisherName?: string | null;
  publisherUrl?: string | null;
  publishYear?: string;
  copies?: number;
  coverContentType?: string | null;
  cover?: string | null;
  author?: IUser | null;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public isbn?: string,
    public name?: string,
    public publisherName?: string | null,
    public publisherUrl?: string | null,
    public publishYear?: string,
    public copies?: number,
    public coverContentType?: string | null,
    public cover?: string | null,
    public author?: IUser | null
  ) {}
}

export function getBookIdentifier(book: IBook): number | undefined {
  return book.id;
}
