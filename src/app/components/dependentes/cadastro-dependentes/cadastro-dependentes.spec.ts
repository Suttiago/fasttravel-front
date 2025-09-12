import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDependentes } from './cadastro-dependentes';

describe('CadastroDependentes', () => {
  let component: CadastroDependentes;
  let fixture: ComponentFixture<CadastroDependentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDependentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDependentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
