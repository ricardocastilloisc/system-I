import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';

AWS.config.update(environment.SESConfig);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  params = {
    GroupName:
      'Administrador' /* es un dato de entrada de la pantalla (grupo al que se agrega o remueve el usuario) */,
    UserPoolId: environment.UserPoolId,
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en al user pool */,
  };

  paramsUser = {
    UserPoolId: environment.UserPoolId,
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en al user pool */,
  };

  paramsGroups = {
    UserPoolId: environment.UserPoolId,
  };

  paramsUsers = {
    UserPoolId: environment.UserPoolId,
    AttributesToGet: [
      'STRING_VALUE',
      /* more items */
    ],
    Filter: 'STRING_VALUE',
    Limit: 'NUMBER_VALUE',
    PaginationToken: 'STRING_VALUE',
  };

  paramsUserGroups = {
    GroupName: 'Administrador' /* es un dato de entrada de la pantalla */,
    Limit: environment.Limit,
    UserPoolId: environment.UserPoolId,
  };

  constructor() {}

  consultarGrupos(): void {
    // metodo para consultar todos los grupos del user pool
    cognitoidentityserviceprovider.listGroups(
      this.paramsGroups,
      this.callbackAws
    );
  }

  consultarUsuarios() {
    // metodo para consultar todos los usuarios del user pool
    return cognitoidentityserviceprovider
      .listUsers(this.paramsGroups)
      .promise();
  }

  consultarUsuariosEnGrupo(): void {
    // metodo para consultar todos los usuarios que pertenecen a un grupo dentro del user pool
    cognitoidentityserviceprovider.listUsersInGroup(
      this.paramsUserGroups,
      this.callbackAws
    );
  }

  obtenerDetalleUsuario(): void {
    // metodo para obtener el los datos a detalle del usuario
    cognitoidentityserviceprovider.adminGetUser(
      this.paramsUser,
      this.callbackAws
    );
  }

  agregarUsuarioGrupo(): void {
    // metodo para agregar a un usuario habilitado en el user pool a un grupo en especifico
    cognitoidentityserviceprovider.adminAddUserToGroup(
      this.params,
      this.callbackAws
    );
  }

  eliminarUsuarioGrupo(): void {
    // metodo para remover a un usuario habilitado en el user pool a un grupo en especifico al que pertenece
    cognitoidentityserviceprovider.adminRemoveUserFromGroup(
      this.params,
      this.callbackAws
    );
  }

  callbackAws = (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  };
  /*
ayuda de atibutos: {Name: "sub", Value: "42ae1b55-8029-4a09-8c81-8c805c650aaf"}
1: {Name: "identities", Value: "[{"userId":"PY5dp6qYCyodowdB_EBAmPy3aF9cV6iO1-k6Ue…null,"primary":true,"dateCreated":1618943540138}]"}
2: {Name: "email_verified", Value: "false"}
3: {Name: "given_name", Value: "Diego"}
4: {Name: "family_name", Value: "Garcia"}
5: {Name: "email", Value: "garcia.diego@principal.com"}
*/

  reformatearArrayDeUsuarios = (objectUsers) => {
    let arrayUsers = [];
    objectUsers.Users.forEach(objectUser =>{
      let object = {
        UserCreateDate: objectUser.UserCreateDate,
        UserLastModifiedDate: objectUser.UserLastModifiedDate,
        Enabled: objectUser.Enabled,
        UserStatus: objectUser.UserStatus,
        Username: objectUser.Username,
        Attributes: {},
      };
      objectUser.Attributes.forEach( attribute => {
        object.Attributes[attribute.Name] = attribute.Value;
      });
      arrayUsers.push(object)
    });
    return arrayUsers
  };
}
