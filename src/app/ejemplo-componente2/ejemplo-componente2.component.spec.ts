import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemploComponente2 } from './ejemplo-componente2.component';

describe('EjemploComponente2Component', () => {
  let component: EjemploComponente2;
  let fixture: ComponentFixture<EjemploComponente2>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EjemploComponente2]
    });
    fixture = TestBed.createComponent(EjemploComponente2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
