import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDestino } from './cadastro-destino';

describe('CadastroDestino', () => {
  let component: CadastroDestino;
  let fixture: ComponentFixture<CadastroDestino>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDestino]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDestino);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
