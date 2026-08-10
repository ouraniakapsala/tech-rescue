import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesFormComponent } from './entities-form.component';

describe('EntitiesForm', () => {
  let component: EntitiesFormComponent;
  let fixture: ComponentFixture<EntitiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitiesFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
