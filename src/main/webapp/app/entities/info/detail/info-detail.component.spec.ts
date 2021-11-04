import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InfoDetailComponent } from './info-detail.component';

describe('Info Management Detail Component', () => {
  let comp: InfoDetailComponent;
  let fixture: ComponentFixture<InfoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ info: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InfoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InfoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load info on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.info).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
