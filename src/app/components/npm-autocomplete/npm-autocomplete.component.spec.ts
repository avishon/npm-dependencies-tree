import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpmAutocompleteComponent } from './npm-autocomplete.component';

describe('NpmAutocompleteComponent', () => {
  let component: NpmAutocompleteComponent;
  let fixture: ComponentFixture<NpmAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpmAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpmAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
