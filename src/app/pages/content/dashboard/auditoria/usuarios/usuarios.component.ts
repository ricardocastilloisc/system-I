import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../../../../../environments/environment.prod';



// me imagino que son configuraciones absolutas  y solo van a cambiar depeendiendo si es produccion o desarrollo?
AWS.config.update(environment.SESConfig);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  //esto es un ejemplo de una interfaz debe de ir en un ts separado

///estos van a cambiar constatantemente????????
  params = {
    GroupName: "Administrador", /* required */
    UserPoolId: "us-east-1_Cx1XNNQxU", /* required */
    Username: "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja" /* required */
  };

  constructor() {
  }

  ngOnInit(): void {


    cognitoidentityserviceprovider.adminAddUserToGroup(this.params, this.callbackAws);
  }

//esto es un callback de tipo promesa al parecer

//verificar si este metodo ca separado y tiene que ir en un servicio para mejor comprencion del core
  callbackAws = (err, data) => {
    console.log("COGNITO IDENTITY SERVICE PROVIDER + USUARIO");

    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);
  }

}
