import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsFormComponent } from './administrators-form.component';

describe('AdministratorsForm', () => {
  let component: AdministratorsFormComponent;
  let fixture: ComponentFixture<AdministratorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
