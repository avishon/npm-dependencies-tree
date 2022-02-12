import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTooltipComponent } from './package-tooltip.component';

describe('PackageTooltipComponent', () => {
  let component: PackageTooltipComponent;
  let fixture: ComponentFixture<PackageTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
