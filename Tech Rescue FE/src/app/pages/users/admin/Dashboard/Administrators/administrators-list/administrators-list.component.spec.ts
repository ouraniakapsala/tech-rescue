import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsListComponent } from './administrators-list.component';

describe('AdministratorsList', () => {
  let component: AdministratorsListComponent;
  let fixture: ComponentFixture<AdministratorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
