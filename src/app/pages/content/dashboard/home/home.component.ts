import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';
import * as AWS from 'aws-sdk';

var params = {
  GroupName: "Ejecutor", /* required */
  UserPoolId: "us-east-1_Cx1XNNQxU", /* required */
  Username: "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja" /* required */
};

const SESConfig = {
  accessKeyId: "AKIAU4J45SEJGVOZU7M6",      // should be:  process.env.AWS_ACCESS_ID
  secretAccessKey: "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",
  region: "us-east-1",
}
AWS.config.update(SESConfig);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  DataUser$: Observable<Usuario>

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);

    cognitoidentityserviceprovider.adminAddUserToGroup(params, function (err, data) {
      console.log("COGNITO IDENTITY SERVICE PROVIDER");

      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response

    });
  }

}
