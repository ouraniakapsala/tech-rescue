import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerOverviewComponent } from './producer-overview.component';

describe('ProducerOverview', () => {
  let component: ProducerOverviewComponent;
  let fixture: ComponentFixture<ProducerOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducerOverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
