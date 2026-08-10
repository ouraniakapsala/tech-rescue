import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerDashboardComponent } from './producerDashboard.component';

describe('ProducerDashboard', () => {
  let component: ProducerDashboardComponent;
  let fixture: ComponentFixture<ProducerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducerDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
