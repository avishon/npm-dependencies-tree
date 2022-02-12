import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpmStatisticsComponent } from './npm-statistics.component';

describe('NpmStatisticsComponent', () => {
  let component: NpmStatisticsComponent;
  let fixture: ComponentFixture<NpmStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpmStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpmStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
