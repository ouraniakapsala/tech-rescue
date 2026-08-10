import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerProfileComponent } from './producer-profile.component';

describe('ProducerProfile', () => {
  let component: ProducerProfileComponent;
  let fixture: ComponentFixture<ProducerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducerProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
