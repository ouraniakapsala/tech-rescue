import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDashboardComponent } from './entity-dashboard.component';

describe('EntityDashboard', () => {
  let component: EntityDashboardComponent;
  let fixture: ComponentFixture<EntityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
