import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpmTreeComponent } from './npm-tree.component';

describe('NpmTreeComponent', () => {
  let component: NpmTreeComponent;
  let fixture: ComponentFixture<NpmTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpmTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpmTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
