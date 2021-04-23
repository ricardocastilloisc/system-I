import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';

var params = {
  GroupName: "Administrador", /* required */
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
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    
    cognitoidentityserviceprovider.adminAddUserToGroup(params, function (err, data) {
      console.log("COGNITO IDENTITY SERVICE PROVIDER + USUARIO");

      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response

    });
  }

}
