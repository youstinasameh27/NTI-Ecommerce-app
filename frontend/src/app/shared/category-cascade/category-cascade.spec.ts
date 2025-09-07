import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCascade } from './category-cascade';

describe('CategoryCascade', () => {
  let component: CategoryCascade;
  let fixture: ComponentFixture<CategoryCascade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCascade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCascade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
