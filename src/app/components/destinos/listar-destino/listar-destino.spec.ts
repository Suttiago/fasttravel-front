import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDestino } from './listar-destino';

describe('ListarDestino', () => {
  let component: ListarDestino;
  let fixture: ComponentFixture<ListarDestino>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDestino]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDestino);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
