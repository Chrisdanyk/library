import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BorrowedBookDetailComponent } from './borrowed-book-detail.component';

describe('BorrowedBook Management Detail Component', () => {
  let comp: BorrowedBookDetailComponent;
  let fixture: ComponentFixture<BorrowedBookDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowedBookDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ borrowedBook: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BorrowedBookDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BorrowedBookDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load borrowedBook on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.borrowedBook).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
