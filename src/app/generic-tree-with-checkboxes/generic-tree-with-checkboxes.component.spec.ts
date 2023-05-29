import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTreeWithCheckboxesComponent } from './generic-tree-with-checkboxes.component';

describe('GenericTreeWithCheckboxesComponent', () => {
  let component: GenericTreeWithCheckboxesComponent;
  let fixture: ComponentFixture<GenericTreeWithCheckboxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericTreeWithCheckboxesComponent]
    });
    fixture = TestBed.createComponent(GenericTreeWithCheckboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
