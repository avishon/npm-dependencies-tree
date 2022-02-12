import { AsyncProcessStatus } from './shared.type';

export interface DependenciesCounterItem {
  name: string;
  count: number;
}

export interface NpmPackageInfoApiResponse {
  name: string;
  version: string;
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
}

export interface NpmPackageAllVersionsApiResponse {
  versions: {
    [key: string]: NpmPackageInfoApiResponse;
  };
}

export enum TreeGeneralStatus {
  EMPTY = "EMPTY",
  LOADING = "LOADING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export class NpmPackageState {
  public generalStatus: TreeGeneralStatus;
  public packageTree: NpmPackageItemTree[];
  constructor() {
    this.generalStatus = TreeGeneralStatus.EMPTY;
    this.packageTree = [];
  }
}

export type NpmPackageNameType = string;
export type NpmPackageVersionType = string;
export interface NpmPackageItemTree {
  name: NpmPackageNameType;
  version: NpmPackageVersionType;
  dependencies: NpmPackageItemTree[];
  isDevDependency?: boolean;
  isRootLevel?: boolean;
  isRetryMode?: boolean;
  status?: AsyncProcessStatus;
}

export class NpmPackageHelper {
  public static getApiPackageVersion(version: NpmPackageVersionType) {
    // Remove some special characters
    version = version.replace(/[~\^\*\>\<\=]+/g, "");

    // Replace '0.x' with '0.0.x', to avoid errors
    version = version.replace(/^0.x$/, "0.0.x");

    // Take the first version if there are more than one.
    version = version.split(" ")[0];
    return version || "latest";
  }

  public static pickVersionFromApi(
    apiRes: NpmPackageAllVersionsApiResponse,
    requestedVersion: NpmPackageVersionType
  ) {
    requestedVersion = this.getApiPackageVersion(requestedVersion);
    const keys = Object.keys(apiRes.versions);
    let versionNumber = keys.find(
      (item) => item.charAt(0) == requestedVersion.charAt(0)
    );
    if (!versionNumber) {
      versionNumber = keys[keys.length - 1];
    }
    return this.getDataFromApi(apiRes.versions[versionNumber]);
  }

  public static getDataFromApi(apiData: NpmPackageInfoApiResponse) {
    if (!this._isValidApiData(apiData)) {
      return null;
    }

    const packageItem = this._createPackageItem(apiData.name, apiData.version);
    packageItem.status = AsyncProcessStatus.COMPLETED;

    Object.entries(apiData.dependencies || []).forEach((item) => {
      packageItem.dependencies.push(this._createPackageItem(item[0], item[1]));
    });
    Object.entries(apiData.devDependencies || []).forEach((item) => {
      packageItem.dependencies.push(
        this._createPackageItem(item[0], item[1], true)
      );
    });
    return packageItem;
  }

  private static _createPackageItem(name: NpmPackageNameType, version: NpmPackageVersionType, isdevDependency = false) {
    return <NpmPackageItemTree>{
      name,
      version,
      dependencies: [],
      isDevDependency: isdevDependency
    };
  }

  private static _isValidApiData(apiData: NpmPackageInfoApiResponse) {
    return apiData && !!apiData.name;
  }
}
