import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducersFormComponent } from './producers-form.component';

describe('ProducersForm', () => {
  let component: ProducersFormComponent;
  let fixture: ComponentFixture<ProducersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducersFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducersFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
