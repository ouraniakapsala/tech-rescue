import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesListComponent } from './entities-list.component';

describe('EntitiesList', () => {
  let component: EntitiesListComponent;
  let fixture: ComponentFixture<EntitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitiesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
