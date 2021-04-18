import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /* configure app with AmplifyUIAngularModule */
    AmplifyUIAngularModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge:25,
      logOnly: environment.production
    })
  ],
  providers: [
    AmplifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
