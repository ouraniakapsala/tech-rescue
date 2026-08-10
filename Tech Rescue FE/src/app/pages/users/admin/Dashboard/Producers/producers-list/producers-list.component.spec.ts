import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducersListComponent } from './producers-list.component';

describe('ProducersList', () => {
  let component: ProducersListComponent;
  let fixture: ComponentFixture<ProducersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducersListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
