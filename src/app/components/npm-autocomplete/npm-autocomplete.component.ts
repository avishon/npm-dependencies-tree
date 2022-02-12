import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { takeUntil, Subject } from "rxjs";
import {
  tap,
  startWith,
  debounceTime,
  distinctUntilChanged,
  filter,
} from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { SearchStoreService } from "../../services/search-store/search-store.service";
import { AsyncProcessStatus } from "src/app/models/shared.type";

@Component({
  selector: "app-npm-autocomplete",
  templateUrl: "./npm-autocomplete.component.html",
  styleUrls: ["./npm-autocomplete.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NpmAutocompleteComponent implements OnInit, OnDestroy {
  @Output() packageSelect = new EventEmitter<string>();
  public searchControl = new FormControl();
  private _searchValue$: Subject<string> = new Subject();
  private _searchTextMinLength = 2;
  private _destroy$ = new Subject();
  constructor(private _searchStoreService: SearchStoreService, private _cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._initInputListeners();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  get options() {
    const state = this._searchStoreService;
    return this._searchValue.length < this._searchTextMinLength
      ? state.cacheResults
      : state.liveResults;
  }

  get isLoading() {
    const status = this._searchStoreService.searchState.status;
    return status == AsyncProcessStatus.IN_PROGRESS;
  }

  get noResults() {
    return (
      this._searchStoreService.searchState.status ==
      AsyncProcessStatus.COMPLETED && this.options.length == 0
    );
  }

  public get packageNameRegex() {
    return environment.npmPackageNameRegex;
  }

  private get _searchValue() {
    return this.searchControl.value || "";
  }

  public onKeyUp(event: KeyboardEvent) {
    const ignore = ['Escape', 'Enter'].includes(event.key);
    if (!ignore) {
      this._searchValue$.next(this._searchValue);
    }
  }

  public onSelected(event: MatAutocompleteSelectedEvent) {
    this.packageSelect.emit(event.option.value);
  }

  public detectChange() {
    this._cdr.detectChanges();
  }

  private _isValidInput(value: string) {
    return value.length >= this._searchTextMinLength;
  }

  private _initInputListeners() {
    this._searchValue$
      .pipe(
        takeUntil(this._destroy$),
        startWith(""),
        filter(this._isValidInput.bind(this)),
        distinctUntilChanged(),
        tap(() => {
          this._searchStoreService.updateStatus(AsyncProcessStatus.IN_PROGRESS);
        }),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm) => {
        this._searchStoreService.search(searchTerm);
      });
  }
}
