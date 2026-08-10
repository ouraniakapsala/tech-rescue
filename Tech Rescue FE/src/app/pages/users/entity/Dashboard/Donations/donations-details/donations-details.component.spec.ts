import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsDetailsComponent } from './donations-details.component';

describe('DonationsDetails', () => {
  let component: DonationsDetailsComponent;
  let fixture: ComponentFixture<DonationsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationsDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
