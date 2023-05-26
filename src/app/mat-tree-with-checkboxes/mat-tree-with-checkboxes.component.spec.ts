import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTreeWithCheckboxesComponent } from './mat-tree-with-checkboxes.component';

describe('MatTreeWithCheckboxesComponent', () => {
  let component: MatTreeWithCheckboxesComponent;
  let fixture: ComponentFixture<MatTreeWithCheckboxesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatTreeWithCheckboxesComponent]
    });
    fixture = TestBed.createComponent(MatTreeWithCheckboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
