import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedBookReturnDialogComponent } from './borrowed-book-return-dialog.component';

describe('BorrowedBookReturnDialogComponent', () => {
  let component: BorrowedBookReturnDialogComponent;
  let fixture: ComponentFixture<BorrowedBookReturnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BorrowedBookReturnDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowedBookReturnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
