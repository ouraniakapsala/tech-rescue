import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesFormComponent } from './types-form.component';

describe('TypesForm', () => {
  let component: TypesFormComponent;
  let fixture: ComponentFixture<TypesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
