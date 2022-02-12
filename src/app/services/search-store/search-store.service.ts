import { Injectable } from "@angular/core";
import { observable, action, computed } from "mobx-angular";
import { makeAutoObservable, runInAction } from "mobx";
import { AsyncProcessStatus } from "../../models/shared.type";
import { NpmSearchState } from "../../models/npm-search.type";
import { NpmPackagesService } from "../npm-packages/npm-packages.service";

@Injectable({
  providedIn: "root",
})

export class SearchStoreService {
  @observable searchState = new NpmSearchState();
  private _cacheMaxItems = 100;
  constructor(private _npmPackagesService: NpmPackagesService) {
    makeAutoObservable(this.searchState);
  }

  @action
  updateStatus(newStatus: AsyncProcessStatus) {
    this.searchState.status = newStatus;
  }

  @action
  async search(searchTerm: string) {
    try {
      this.searchState.status = AsyncProcessStatus.IN_PROGRESS;
      const results = await this._npmPackagesService.search(searchTerm);
      this.searchState.status = AsyncProcessStatus.COMPLETED;
      this.searchState.liveResults = results;
      runInAction(() => this._saveInCache(results));
    } catch (e) {
      this.searchState.status = AsyncProcessStatus.ERROR;
    }
  }

  @computed
  get cacheResults() {
    return this.searchState.cacheResults.concat();
  }

  @computed
  get liveResults() {
    return this.searchState.liveResults.concat();
  }

  private _saveInCache(liveResults: string[]) {
    const existingCache = this.searchState.cacheResults;
    let newCache = existingCache.concat(liveResults);
    newCache = [...new Set([...liveResults, ...existingCache])];
    if (newCache.length > this._cacheMaxItems) {
      newCache.length = this._cacheMaxItems;
    }
    this.searchState.cacheResults = newCache;
  }
}
