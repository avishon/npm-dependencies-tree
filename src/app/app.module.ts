import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MobxAngularModule } from 'mobx-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NpmTreeComponent } from './components/npm-tree/npm-tree.component';
import { NpmAutocompleteComponent } from './components/npm-autocomplete/npm-autocomplete.component';
import { ClickOutsideDirective } from './shared/directives/click-outside/click-outside.directive';
import { PackageTooltipComponent } from './components/npm-tree/package-tooltip/package-tooltip.component';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { NpmStatisticsComponent } from './components/npm-statistics/npm-statistics.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NpmTreeComponent,
    NpmAutocompleteComponent,
    ClickOutsideDirective,
    PackageTooltipComponent,
    ToastNotificationComponent,
    NpmStatisticsComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MobxAngularModule,
    FormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
