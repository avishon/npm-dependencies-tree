import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {
  NpmPackageInfoApiResponse,
  NpmPackageHelper,
  NpmPackageItemTree,
  NpmPackageAllVersionsApiResponse,
  NpmPackageNameType,
  NpmPackageVersionType,
  DependenciesCounterItem
} from "../../models/npm-tree.type";
import { NpmPackageSearchApiResponse } from '../../models/npm-search.type';
import { map, tap } from "rxjs/operators";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NpmPackagesService {
  private _dependenciesVersionsCache: Map<string, NpmPackageItemTree> = new Map();
  private _dependenciesCounterCache: Map<string, number> = new Map();
  constructor(private _http: HttpClient) {
  }

  public getNumberOfDependents(packageName: NpmPackageNameType) {
    return this._dependenciesCounterCache.get(packageName);
  }

  public async getPackageRootItem(packageName: NpmPackageNameType) {
    this._dependenciesVersionsCache.clear();
    this._dependenciesCounterCache.clear();
    return await this._getPackageByName(packageName, "");
  }

  public async getPackageDependencies(packageItem: NpmPackageItemTree) {
    return await this._getPackageByName(packageItem.name, packageItem.version, packageItem.isRetryMode);
  }

  public getDependenciesCounterMap(): DependenciesCounterItem[] {
    const sortedMap = new Map([...this._dependenciesCounterCache.entries()].sort((a, b) => b[1] - a[1]))
    return Array.from(sortedMap, ([name, count]) => ({ name, count }));
  }

  public async search(
    text: string
  ) {
    const size = environment.npmPackagesSearchResultsLimit;
    const data$ = this._http
      .get<NpmPackageSearchApiResponse>(
        environment.npmPackagesSearchApiUrl,
        { observe: "body", params: { text, size } }
      )
      .pipe(
        map((res) => {
          return res.objects.map(item => {
            return item.package.name
          })
        })
      );
    return await firstValueFrom(data$);
  }

  private async _getPackageAllVersions(
    packageName: NpmPackageNameType,
    requestedVersion: NpmPackageVersionType
  ) {
    const data$ = this._http
      .get<NpmPackageAllVersionsApiResponse>(
        `${environment.npmPackageInfoApiUrl}${packageName}`,
        { observe: "body" }
      )
      .pipe(
        map((res) => {
          const data = NpmPackageHelper.pickVersionFromApi(
            res,
            requestedVersion
          );
          if (data) {
            return data;
          }
          throw 'Invalid package data';
        })
      );
    return await firstValueFrom(data$);
  }

  private async _getPackageByName(name: NpmPackageNameType, version: NpmPackageVersionType, isRetryMode = false) {
    if (isRetryMode) {
      return await this._getPackageAllVersions(name, version);
    }
    version = NpmPackageHelper.getApiPackageVersion(version);
    const itemFromCache = this._getDependenciesVersionsFromCache(name, version);
    if (itemFromCache) {
      return itemFromCache;
    }
    const data$ = this._http
      .get<NpmPackageInfoApiResponse>(
        `${environment.npmPackageInfoApiUrl}${name}/${version}`,
        { observe: "body" }
      )
      .pipe(
        map((res) => {
          const data = NpmPackageHelper.getDataFromApi(res);
          if (data) {
            return data;
          }
          throw 'Invalid package data';
        }),
        tap(item => {
          this._addToDependenciesVersionsCache(item, version);
          this._addToDependenciesCounterMap(item);
        })

      );
    return await firstValueFrom(data$);
  }

  private _getDependenciesVersionsFromCache(packageName: NpmPackageNameType, requestedVesion: NpmPackageVersionType) {
    const mapKey = `${packageName}##${requestedVesion}`;
    return this._dependenciesVersionsCache.get(mapKey);
  }


  private _addToDependenciesVersionsCache(packageItem: NpmPackageItemTree, requestedVesion: NpmPackageVersionType) {
    const mapKey = `${packageItem.name}##${requestedVesion}`;
    if (!this._dependenciesVersionsCache.has(mapKey)) {
      this._dependenciesVersionsCache.set(mapKey, JSON.parse(JSON.stringify(packageItem)))
    }
  }

  private _addToDependenciesCounterMap(packageItem: NpmPackageItemTree) {
    packageItem.dependencies.forEach(item => {
      let counter = this._dependenciesCounterCache.get(item.name);
      counter = counter ? counter + 1 : 1;
      this._dependenciesCounterCache.set(item.name, counter);
    })
  }

}
