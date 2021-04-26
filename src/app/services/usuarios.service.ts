import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';

AWS.config.update(environment.SESConfig);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {

  params = {
    GroupName: "Administrador", /* es un dato de entrada del front */
    UserPoolId: "us-east-1_Cx1XNNQxU", /* mandar a enviroment */
    Username: "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja" /* mandar a enviroment */
  };

  paramsUser = {
    UserPoolId: "us-east-1_Cx1XNNQxU", /* mandar a enviroment */
    Username: "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja" /* mandar a enviroment */
  };

  paramsGroups = {
    UserPoolId: "us-east-1_Cx1XNNQxU", /* mandar a enviroment */
  };

  paramsUsers = { 
    UserPoolId: "us-east-1_Cx1XNNQxU", /* mandar a enviroment */
    AttributesToGet: [
      'STRING_VALUE', 
      /* more items */ 
    ], 
    Filter: 'STRING_VALUE', 
    Limit: 'NUMBER_VALUE', 
    PaginationToken: 'STRING_VALUE' 
  }; 
  
  constructor() { }

  consultarGrupos(): void {
    cognitoidentityserviceprovider.listGroups(this.paramsGroups, this.callbackAws);
  }

  consultarUsuarios(): void {
    cognitoidentityserviceprovider.listUsers(this.paramsGroups, this.callbackAws);
  }

  obtenerDetalleUsuario(): void {
    cognitoidentityserviceprovider.adminGetUser(this.paramsUser, this.callbackAws);
  }

  agregarUsuarioGrupo(): void {
    cognitoidentityserviceprovider.adminAddUserToGroup(this.params, this.callbackAws);
  }

  eliminarUsuarioGrupo(): void {
    cognitoidentityserviceprovider.adminRemoveUserFromGroup(this.params, this.callbackAws);
  }

  callbackAws = (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  }

}
