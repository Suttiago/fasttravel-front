import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDependentes } from './listar-dependentes';

describe('ListarDependentes', () => {
  let component: ListarDependentes;
  let fixture: ComponentFixture<ListarDependentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDependentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDependentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
