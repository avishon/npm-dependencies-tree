import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

export interface TooltipData {
  version: string;
  numberOfDependents: number;
  isDevDependency: boolean;
}

@Component({
  selector: 'app-package-tooltip',
  templateUrl: './package-tooltip.component.html',
  styleUrls: ['./package-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageTooltipComponent {
  @Input() tooltipData: TooltipData;
  constructor() {}
}
