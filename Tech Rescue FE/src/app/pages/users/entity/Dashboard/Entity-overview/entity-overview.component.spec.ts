import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityOverviewComponent } from './entity-overview.component';

describe('EntityOverview', () => {
  let component: EntityOverviewComponent;
  let fixture: ComponentFixture<EntityOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityOverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
