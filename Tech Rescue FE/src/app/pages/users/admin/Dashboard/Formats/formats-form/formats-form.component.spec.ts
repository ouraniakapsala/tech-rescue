import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatsFormComponent } from './formats-form.component';

describe('FormatsForm', () => {
  let component: FormatsFormComponent;
  let fixture: ComponentFixture<FormatsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormatsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
