import { Injectable } from "@angular/core";
import { observable, action } from "mobx-angular";
import { makeAutoObservable, runInAction } from "mobx";
import {
  NpmPackageState,
  TreeGeneralStatus,
  NpmPackageItemTree,
  NpmPackageNameType
} from "../../models/npm-tree.type";
import { AsyncProcessStatus } from "../../models/shared.type";
import { NpmPackagesService } from "../npm-packages/npm-packages.service";

@Injectable({
  providedIn: "root",
})
export class TreeStoreService {
  @observable treeState = new NpmPackageState();

  constructor(private _npmPackagesService: NpmPackagesService) {
    makeAutoObservable(this.treeState);
  }

  @action
  async getPackageRootItem(name: NpmPackageNameType) {
    try {
      this.treeState.generalStatus = TreeGeneralStatus.LOADING;
      const packageRootItem = await this._npmPackagesService.getPackageRootItem(
        name
      );

      packageRootItem.isRootLevel = true;
      packageRootItem.status = AsyncProcessStatus.COMPLETED;
      runInAction(() => {
        this.treeState.packageTree = [packageRootItem];
        this.treeState.generalStatus = TreeGeneralStatus.COMPLETED;
      });
    } catch (e) {
      this.treeState.generalStatus = TreeGeneralStatus.ERROR;
    }
  }

  @action
  async getPackageDependencies(packageItem: NpmPackageItemTree) {
    runInAction(() => {
      packageItem.status = AsyncProcessStatus.IN_PROGRESS;
    });
    try {
      const packageData = await this._npmPackagesService.getPackageDependencies(
        packageItem
      );
      runInAction(async () => {
        packageItem.dependencies = packageData.dependencies;
        packageItem.status = packageData.status;
        packageItem.isRetryMode = false;
      });
    } catch (e) {
      runInAction(async () => {
        packageItem.isRetryMode = true;
        packageItem.status = AsyncProcessStatus.ERROR;
      });
    }
  }
}
