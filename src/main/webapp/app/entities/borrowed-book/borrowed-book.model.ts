import * as dayjs from 'dayjs';
import { IBook } from 'app/entities/book/book.model';
import { IUser } from 'app/entities/user/user.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IBorrowedBook {
  id?: number;
  borrowDate?: dayjs.Dayjs | null;
  returnDate?: dayjs.Dayjs | null;
  status?: Status;
  book?: IBook | null;
  client?: IUser | null;
}

export class BorrowedBook implements IBorrowedBook {
  constructor(
    public id?: number,
    public borrowDate?: dayjs.Dayjs | null,
    public returnDate?: dayjs.Dayjs | null,
    public status?: Status,
    public book?: IBook | null,
    public client?: IUser | null
  ) {}
}

export function getBorrowedBookIdentifier(borrowedBook: IBorrowedBook): number | undefined {
  return borrowedBook.id;
}
