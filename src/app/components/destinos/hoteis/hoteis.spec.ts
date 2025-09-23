import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hoteis } from './hoteis';

describe('Hoteis', () => {
  let component: Hoteis;
  let fixture: ComponentFixture<Hoteis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hoteis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hoteis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
