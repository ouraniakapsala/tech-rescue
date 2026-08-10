import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesListComponent } from './types-list.component';

describe('TypesList', () => {
  let component: TypesListComponent;
  let fixture: ComponentFixture<TypesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
