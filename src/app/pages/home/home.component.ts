import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
  public rootPackageName: string;
  public showTable: boolean;

  onPackageSelect(packageName: string) {
    this.rootPackageName = packageName;
  }

}
