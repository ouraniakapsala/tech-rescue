import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusesFormComponent } from './statuses-form.component';

describe('StatusesForm', () => {
  let component: StatusesFormComponent;
  let fixture: ComponentFixture<StatusesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusesFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
