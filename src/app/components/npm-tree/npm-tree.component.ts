import { Component, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NpmPackagesService } from '../../services/npm-packages/npm-packages.service';
import { NpmPackageState, NpmPackageItemTree, NpmPackageNameType, TreeGeneralStatus } from '../../models/npm-tree.type';
import { AsyncProcessStatus } from '../../models/shared.type';
import { TreeStoreService } from '../../services/tree-store/tree-store.service';
import { TooltipData } from './package-tooltip/package-tooltip.component';

@Component({
  selector: 'app-npm-tree',
  templateUrl: './npm-tree.component.html',
  styleUrls: ['./npm-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NpmTreeComponent implements OnChanges {
  @Input() rootPackageName: NpmPackageNameType;
  @Output() packageClick = new EventEmitter<string>();
  public packageTreeState: NpmPackageState;
  public selectedTooltip: NpmPackageItemTree | undefined;
  public tooltipData: TooltipData;
  constructor(
    private _npmPackagesService: NpmPackagesService,
    private _treeStoreService: TreeStoreService,
    private _cdr: ChangeDetectorRef
  ) {
    this.packageTreeState = new NpmPackageState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rootPackageName']) {
      this._treeStoreService.getPackageRootItem(this.rootPackageName);
    }
  }

  public get isPageLoading() {
    return this._treeStoreService.treeState.generalStatus == TreeGeneralStatus.LOADING;
  }

  public get isPageReady() {
    return this._treeStoreService.treeState.generalStatus == TreeGeneralStatus.COMPLETED;
  }

  public get isPageError() {
    return this._treeStoreService.treeState.generalStatus == TreeGeneralStatus.ERROR;
  }

  public get tree() {
    return this._treeStoreService.treeState.packageTree;
  }

  public isCompleted(packageItem: NpmPackageItemTree) {
    return packageItem.status == AsyncProcessStatus.COMPLETED;
  }

  public isInProgress(packageItem: NpmPackageItemTree) {
    return packageItem.status == AsyncProcessStatus.IN_PROGRESS;
  }

  public isEmpty(packageItem: NpmPackageItemTree) {
    return this.isCompleted(packageItem) && packageItem.dependencies.length == 0;
  }

  public isError(packageItem: NpmPackageItemTree) {
    return packageItem.status == AsyncProcessStatus.ERROR;
  }

  public removeTooltip() {
    delete this.selectedTooltip;
  }

  public showTooltip(event: Event, packageItem: NpmPackageItemTree) {
    const numberOfDependents = this._npmPackagesService.getNumberOfDependents(packageItem.name) || 0;
    this.tooltipData = {
      version: packageItem.version,
      isDevDependency: !!packageItem.isDevDependency,
      numberOfDependents
    }
    this.selectedTooltip = packageItem;
    event.stopPropagation();
  }

  public getPackage(event: Event, packageItem: NpmPackageItemTree, listItemEl: HTMLElement) {
    event.stopPropagation();
    if (this.isEmpty(packageItem)) {
      return;
    }
    this.packageClick.emit();
    if (!this.isCompleted(packageItem) && !this.isInProgress(packageItem)) {
      this._treeStoreService.getPackageDependencies(packageItem);
    }
    listItemEl.classList.toggle('open');
  }
}
