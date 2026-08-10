import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsListComponent } from './donations-list.component';

describe('DonationsList', () => {
  let component: DonationsListComponent;
  let fixture: ComponentFixture<DonationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
