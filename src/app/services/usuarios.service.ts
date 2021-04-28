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
    GroupName: "Administrador", /* es un dato de entrada de la pantalla (grupo al que se agrega o remueve el usuario) */
    UserPoolId: environment.UserPoolId,
    Username: "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja" /* identificador del usuario en al user pool */
  };

  paramsUser = {
    UserPoolId: environment.UserPoolId,
    Username: "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja" /* identificador del usuario en al user pool */
  };

  paramsGroups = {
    UserPoolId: environment.UserPoolId
  };

  paramsUsers = {
    UserPoolId: environment.UserPoolId,
    AttributesToGet: [
      'STRING_VALUE',
      /* more items */
    ],
    Filter: 'STRING_VALUE',
    Limit: 'NUMBER_VALUE',
    PaginationToken: 'STRING_VALUE'
  };

  paramsUserGroups = {
    GroupName: "Administrador", /* es un dato de entrada de la pantalla */
    Limit: environment.Limit,
    UserPoolId: environment.UserPoolId,
  };

  constructor() { }

  consultarGrupos(): void {
    // metodo para consultar todos los grupos del user pool
    cognitoidentityserviceprovider.listGroups(this.paramsGroups, this.callbackAws);
  }

  consultarUsuarios(): void {
    // metodo para consultar todos los usuarios del user pool
    cognitoidentityserviceprovider.listUsers(this.paramsGroups, this.callbackAws);
  }

  consultarUsuariosEnGrupo(): void {
    // metodo para consultar todos los usuarios que pertenecen a un grupo dentro del user pool
    cognitoidentityserviceprovider.listUsersInGroup(this.paramsUserGroups, this.callbackAws);
  }

  obtenerDetalleUsuario(): void {
    // metodo para obtener el los datos a detalle del usuario
    cognitoidentityserviceprovider.adminGetUser(this.paramsUser, this.callbackAws);
  }

  agregarUsuarioGrupo(): void {
    // metodo para agregar a un usuario habilitado en el user pool a un grupo en especifico
    cognitoidentityserviceprovider.adminAddUserToGroup(this.params, this.callbackAws);
  }

  eliminarUsuarioGrupo(): void {
    // metodo para remover a un usuario habilitado en el user pool a un grupo en especifico al que pertenece
    cognitoidentityserviceprovider.adminRemoveUserFromGroup(this.params, this.callbackAws);
  }

  callbackAws = (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  }

}
