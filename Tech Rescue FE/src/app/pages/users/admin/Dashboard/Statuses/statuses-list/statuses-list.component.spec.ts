import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusesListComponent } from './statuses-list.component';

describe('StatusesList', () => {
  let component: StatusesListComponent;
  let fixture: ComponentFixture<StatusesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
