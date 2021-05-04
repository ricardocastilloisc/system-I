import { ProcesoTerminado } from './../ReduxStore/actions/loaderProcesoCambios.actions';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { AppState } from '../ReduxStore/app.reducers';
import { Store } from '@ngrx/store';
import { setUserArea } from '../ReduxStore/actions/usuario.actions';
import { ERole } from '../validators/roles';
import { ConsultaUsuario } from '../ReduxStore/reducers';
import { ValorFiltrarGrupo } from '../validators/opcionesDeFiltroUsuarioAdmininistracion';

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
    GroupName:
      'Administrador' /* es un dato de entrada de la pantalla */ /* --> ?? relacionado a la tabla --> roles  */,
    Limit: environment.Limit,
    UserPoolId: environment.UserPoolId,
  };

  paramsAtributos = {
    UserAttributes: [
      {
        Name: 'custom:area',
        Value: 'Tesorería',
      },
    ],
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en el user pool */,
    UserPoolId: environment.UserPoolId,
  };

  paramsGrupoUsuario = {
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en el user pool */,
    UserPoolId: environment.UserPoolId,
  };

  Grupos = [
    ERole.Administrador,
    ERole.AdministradorArea,
    ERole.Ejecutor,
    ERole.Soporte,
  ];

  numeroDeProcesos = 0;

  constructor(private store: Store<AppState>) { }

  consultarGrupos(): void {
    // metodo para consultar todos los grupos del user pool
    cognitoidentityserviceprovider.listGroups(
      this.paramsGroups,
      this.callbackAws
    );
  }

  consultarUsuariosEnGrupo = (parametro) => {
    const paramsUserGroups = {
      GroupName: parametro /* es un dato de entrada de la pantalla */ /* --> ???? relacionado a la tabla */,
      Limit: environment.Limit,
      UserPoolId: environment.UserPoolId,
    };
    return cognitoidentityserviceprovider.listUsersInGroup(paramsUserGroups);
  };

  consultarUsuarios = () => {
    // metodo para consultar todos los usuarios del user pool
    return cognitoidentityserviceprovider.listUsers(this.paramsGroups);
  };

  consultaSinFiltroYConFiltro = (consulta: ConsultaUsuario | null) => {
    let promesa = this.consultarUsuarios();
    if (consulta) {
      switch (consulta.tipo) {
        case ValorFiltrarGrupo.Grupo:
          promesa = this.consultarUsuariosEnGrupo(consulta.parametro);
      }
    }
    return promesa.promise();
  };

  consultaUsuariosMultipleFactor = (parametro) => {
    return new Promise((resolve) => {
      let ObjectUsers = [];
      let UserList = [];
      this.consultaSinFiltroYConFiltro(parametro).then(({ Users }) => {
        ObjectUsers = [...Users];
        if (ObjectUsers.length === 0) {
          resolve(ObjectUsers);
        }
        const flagDeTerminado = ObjectUsers.length;
        let comparacion = 0;
        ObjectUsers.forEach((UserElement, index) => {
          this.obtenerGrupoUsuarioPromise(UserElement.Username).then(
            ({ Groups }) => {
              Groups.forEach((e, indexGroup) => {
                let tempString = '';
                if (e.hasOwnProperty('GroupName')) {
                  tempString = e.GroupName;
                }
                this.Grupos.forEach((validador) => {
                  if (validador === tempString) {
                    ObjectUsers[index].GrupoQuePertenece = tempString;
                  }
                });
                if (indexGroup + 1 === Groups.length) {
                  UserList.push(
                    this.reformatearArrayDeUsuarios(ObjectUsers[index])
                  );
                }
                if (indexGroup + 1 === Groups.length) {
                  comparacion = comparacion + 1;
                }
              });
            }
          );
        });
        new Promise((resolve2) => {
          const intervalo = setInterval(() => {
            if (comparacion === flagDeTerminado) {
              resolve2('ok');
              clearInterval(intervalo);
            }
          }, 100);
        }).then(() => {
          resolve(UserList);
        });
      });
    });
  };



  obtenerDetalleUsuario(): void {
    // metodo para obtener el los datos a detalle del usuario
    cognitoidentityserviceprovider.adminGetUser(
      this.paramsUser,
      this.callbackAwsDetalle
    );
  }

  agregarUsuarioGrupo(GroupName, Username) {
    const params = {
      GroupName: GroupName,
      UserPoolId: environment.UserPoolId,
      Username: Username,
    };
    // metodo para agregar a un usuario habilitado en el user pool a un grupo en especifico
    return cognitoidentityserviceprovider.adminAddUserToGroup(params).promise();
  }

  eliminarUsuarioGrupo(GroupName, Username) {
    const params = {
      GroupName: GroupName,
      UserPoolId: environment.UserPoolId,
      Username: Username,
    };

    let terminado = null;

    if(GroupName.trim().length === 0){
      terminado = 1;
    }else{
      cognitoidentityserviceprovider.adminRemoveUserFromGroup(
        params,
        (err, data) => {
          if (err) {
            terminado = 1;
          } else {
            terminado = 1;
          }
        }
      );
    }

    new Promise((resolve) => {
      const intervalo = setInterval(() => {
        if (terminado) {
          resolve('ok');
          clearInterval(intervalo);
        }
      }, 100);
    }).then(() => {
      this.numeroDeProcesos++;
    });
  }


  validacionDeProcesosInsertar = (numeroProcesosComparar, procesos) => {
    
  }

  validacionDeProcesosEliminar = (numeroProcesosComparar, procesos) => {

    const {Grupo} = procesos;

    const {GroupName, Username} = Grupo;

    this.eliminarUsuarioGrupo(GroupName, Username);

    new Promise((resolve) => {
      const intervalo = setInterval(() => {
        if (numeroProcesosComparar === this.numeroDeProcesos) {
          resolve('ok');
          clearInterval(intervalo);
        }
      }, 100);
    }).then(() => {
      this.numeroDeProcesos = 0;
      this.store.dispatch(ProcesoTerminado());
    });
  }

  actualizarAtributosUsuario(): void {
    // metodo para actualizar los valores de los atributos del usuario en el user pool
    cognitoidentityserviceprovider.adminUpdateUserAttributes(
      this.paramsAtributos,
      this.callbackAws
    );
  }

  obtenerGrupoUsuarioPromise = (username) => {
    let paramsGrupoUsuario = {
      Username: username /* identificador del usuario en el user pool */,
      UserPoolId: environment.UserPoolId,
    };
    return cognitoidentityserviceprovider
      .adminListGroupsForUser(paramsGrupoUsuario)
      .promise();
  };

  obtenerGruposUsuario(): void {
    // metodo para consultar los grupos a los que pertenece un usuario del user pool
    cognitoidentityserviceprovider.adminListGroupsForUser(
      this.paramsGrupoUsuario,
      this.callbackAws
    );
  }

  public validarRolUsuario(): boolean {
    var banderaRol = false;
    this.store.select(({ usuario }) => usuario.user).subscribe(user =>{
      if(user){
        banderaRol = this.Grupos.includes(user.groups[0]);
      }
    });
    return banderaRol;
  }


  callbackAws = (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  };

  callbackAwsDetalle = (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      var area = data['UserAttributes'].find((el) => el.Name == 'custom:area')[
        'Value'
      ];
      this.store.dispatch(
        setUserArea({
          area: area,
        })
      );
    }
  };

  /*
ayuda de atibutos: {Name: "sub", Value: "42ae1b55-8029-4a09-8c81-8c805c650aaf"}
1: {Name: "identities", Value: "[{"userId":"PY5dp6qYCyodowdB_EBAmPy3aF9cV6iO1-k6Ue…null,"primary":true,"dateCreated":1618943540138}]"}
2: {Name: "email_verified", Value: "false"}
3: {Name: "given_name", Value: "Diego"}
4: {Name: "family_name", Value: "Garcia"}
5: {Name: "email", Value: "garcia.diego@principal.com"}
*/

  reformatearArrayDeUsuarios = (objectUser) => {
    let object = {
      UserCreateDate: objectUser.UserCreateDate,
      UserLastModifiedDate: objectUser.UserLastModifiedDate,
      Enabled: objectUser.Enabled,
      UserStatus: objectUser.UserStatus,
      Username: objectUser.Username,
      GrupoQuePertenece: objectUser.hasOwnProperty('GrupoQuePertenece')
        ? objectUser.GrupoQuePertenece
        : '',
      Attributes: {},
    };
    objectUser.Attributes.forEach((attribute) => {
      object.Attributes[attribute.Name] = attribute.Value;
    });
    return object;
  };
}
