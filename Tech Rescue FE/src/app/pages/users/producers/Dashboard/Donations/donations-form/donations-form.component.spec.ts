import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsFormComponent } from './donations-form.component';

describe('DonationsForm', () => {
  let component: DonationsFormComponent;
  let fixture: ComponentFixture<DonationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
