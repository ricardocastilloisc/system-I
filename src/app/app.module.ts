import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

/* import AmplifyUIAngularModule  */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { StoreModule } from '@ngrx/store';
import Amplify from 'aws-amplify';
import { AmplifyService } from 'aws-amplify-angular';
import awsconfig from '../aws-exports';

/* Configure Amplify resources */
Amplify.configure(awsconfig);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { appReducers } from './ReduxStore/app.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { EffectsArrays } from './ReduxStore/effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';

// importar locales
import localeMX from '@angular/common/locales/es-MX';
import { ToastrModule } from 'ngx-toastr';
// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localeMX, 'es-MX');




@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    /* configure app with AmplifyUIAngularModule */
    AmplifyUIAngularModule,
    ToastrModule.forRoot(
      {
      preventDuplicates: true
    }),
    NgMultiSelectDropDownModule.forRoot(),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(EffectsArrays),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    NgbModule,
  ],
  providers: [
    AmplifyService,
    DatePipe,

    { provide: LOCALE_ID, useValue: 'es-MX' },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
