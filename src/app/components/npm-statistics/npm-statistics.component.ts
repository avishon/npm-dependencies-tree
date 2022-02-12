import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { NpmPackagesService } from '../../services/npm-packages/npm-packages.service';
import { DependenciesCounterItem } from '../../models/npm-tree.type';

@Component({
  selector: 'app-npm-statistics',
  templateUrl: './npm-statistics.component.html',
  styleUrls: ['./npm-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NpmStatisticsComponent implements OnInit {
  @Output() clickClose = new EventEmitter<void>();
  public packagesList: DependenciesCounterItem[];
  constructor(
    private _npmPackagesService: NpmPackagesService
  ) { }

  ngOnInit(): void {
    this.packagesList = this._npmPackagesService.getDependenciesCounterMap();
  }
}
