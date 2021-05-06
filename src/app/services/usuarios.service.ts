import { ProcesoTerminado } from './../ReduxStore/actions/loaderProcesoCambios.actions';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { AppState } from '../ReduxStore/app.reducers';
import { Store } from '@ngrx/store';
import { setUserRol, setUserArea } from '../ReduxStore/actions/usuario.actions';
import { ERole, ENegocio, EArea } from '../validators/roles';
import { ConsultaUsuario } from '../ReduxStore/reducers';
import { ValorFiltrarGrupo } from '../validators/opcionesDeFiltroUsuarioAdmininistracion';
import { UsuarioListado } from '../model/usuarioLitsa.model';

AWS.config.update(environment.SESConfig);
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var result = [];
var objFiltrado = [];

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  Roles = [ERole.Administrador, ERole.Ejecutor, ERole.Soporte];

  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
  ];

  Negocios = [
    ENegocio.Afore,
    ENegocio.Afore_Fondos,
    ENegocio.Fondos,
    ENegocio.Seguros,
  ];

  params = {
    GroupName:
      'Tesoreria' /* es un dato de entrada de la pantalla (grupo al que se agrega o remueve el usuario) */,
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

  paramsUserGroups = {
    GroupName: 'Tesoreria' /* es un dato de entrada de la pantalla */,
    Limit: environment.Limit,
    UserPoolId: environment.UserPoolId,
  };

  paramsAtributos = {
    UserAttributes: [
      {
        Name: 'custom:negocio',
        Value: 'Afore' /* campo de entrada identificado como negocio */,
      },
      {
        Name: 'custom:rol',
        Value: 'Soporte' /* campo de entrada identificado como permiso */,
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

  numeroDeProcesos = 0;

  constructor(private store: Store<AppState>) {}

  consultarGrupos(): void {
    // metodo para consultar todos los grupos del user pool
    cognitoidentityserviceprovider.listGroups(
      this.paramsGroups,
      this.callbackAws
    );
  }

  consultarUsuariosEnGrupo = (grupo) => {
    // método para consultar todos los usuarios que existen en un grupo del user pool
    const params = {
      GroupName: grupo,
      Limit: environment.Limit,
      UserPoolId: environment.UserPoolId,
    };
    return cognitoidentityserviceprovider.listUsersInGroup(params);
  };

  consultarUsuarios = () => {
    // metodo para consultar todos los usuarios del user pool
    //return cognitoidentityserviceprovider.listUsers(this.paramsGroups,this.callbackAws);
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
                this.Areas.forEach((validador) => {
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

  agregarUsuarioGrupo(grupo, usuario) {
    const params = {
      GroupName: grupo,
      UserPoolId: environment.UserPoolId,
      Username: usuario,
    };
    // metodo para agregar a un usuario habilitado en el user pool a un grupo en especifico
    return cognitoidentityserviceprovider.adminAddUserToGroup(params).promise();
  }

  eliminarUsuarioGrupo(grupo, usuario) {
    const params = {
      GroupName: grupo,
      UserPoolId: environment.UserPoolId,
      Username: usuario,
    };

    let terminado = null;

    if (grupo.trim().length === 0) {
      terminado = 1;
    } else {
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

  /// esta aparte al compoennete de usarios
  eliminarYAgregarGrupo = (Grupo, Username, GrupoOriginal) => {
    const params = {
      GroupName: GrupoOriginal,
      UserPoolId: environment.UserPoolId,
      Username: Username,
    };

    let terminado = null;

    if (GrupoOriginal.trim().length === 0) {
      terminado = 1;
    } else {
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
      this.agregarUsuarioGrupoCallback(Grupo, Username);
    });
  };
  /// esta aparte al compoennete de usarios
  agregarUsuarioGrupoCallback(grupo, usuario) {
    const params = {
      GroupName: grupo,
      UserPoolId: environment.UserPoolId,
      Username: usuario,
    };

    let terminado = null;
    cognitoidentityserviceprovider.adminAddUserToGroup(params, (err, data) => {
      if (err) {
        terminado = 1;
      } else {
        terminado = 1;
      }
    });
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

  actualizarAtributosUsuarioCallback = (UserAttributes, Username) => {
    const paramsAtributos = {
      UserAttributes: UserAttributes,
      Username: Username /* identificador del usuario en el user pool */,
      UserPoolId: environment.UserPoolId,
    };
    let terminado = null;
    cognitoidentityserviceprovider.adminUpdateUserAttributes(
      paramsAtributos,
      (err, data) => {
        if (err) {
          terminado = 1;
        } else {
          terminado = 1;
        }
      }
    );
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
  };

  /// esta aparte al compoennete de usarios
  validacionDeProcesosInsertar = (Attributos, paramGrupo) => {
    let numeroProcesosComparar = 2;

    const { Grupo, Username, GrupoOriginal } = paramGrupo;

    const { UserAttributes } = Attributos;

    this.eliminarYAgregarGrupo(Grupo, Username, GrupoOriginal);

    this.actualizarAtributosUsuarioCallback(UserAttributes, Username);

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
  };

  actualizarAtributosUsuario = (UserAttributes, Username) => {
    // metodo para actualizar los valores de los atributos del usuario en el user pool
    /* cognitoidentityserviceprovider.adminUpdateUserAttributes(
    this.paramsAtributos,
    this.callbackAws
  );*/

    const paramsAtributos = {
      UserAttributes: UserAttributes,
      Username: Username /* identificador del usuario en el user pool */,
      UserPoolId: environment.UserPoolId,
    };
    return cognitoidentityserviceprovider
      .adminUpdateUserAttributes(paramsAtributos)
      .promise();
  };

  obtenerGrupoUsuarioPromise = (usuario) => {
    let params = {
      Username: usuario /* identificador del usuario en el user pool */,
      UserPoolId: environment.UserPoolId,
    };
    return cognitoidentityserviceprovider
      .adminListGroupsForUser(params)
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
    let flagValidate = false;
    this.store
      .select(({ usuario }) => usuario.user)
      .subscribe(({ attributes }: any) => {
        // console.log(attributes);
        if (!attributes.hasOwnProperty('custom:rol')) {
          return flagValidate;
        } else {
          if (this.Roles.includes(attributes['custom:rol'])) {
            flagValidate = true;
          }
        }
      });
    return flagValidate;
  }

  callbackAws = (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(JSON.stringify(data));
  };

  callbackAwsDetalle = (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(JSON.stringify(data));
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

  filtrarUsuariosConAtributos = (
    usuarios: UsuarioListado[],
    permiso,
    areas,
    correo
  ) => {
    let Usuarios = [...usuarios];

    if (correo != null) {
      Usuarios = Usuarios.filter((e) => e.Attributes['email'] === correo);
    }

    if (permiso != null) {
      let arrayTempPermiso = [];
      permiso.forEach((permiso) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...Usuarios.filter((e) => e.Attributes['custom:rol'] === permiso),
        ];
      });
      Usuarios = arrayTempPermiso;
    }
    if (areas != null) {
      let arrayTempArea = [];

      areas.forEach((area) => {
        Usuarios.forEach((usuario) => {
          let areaArrayAtributoTemp =
            usuario.GrupoQuePertenece.trim().length === 0
              ? []
              : usuario.GrupoQuePertenece.split(',');

          if (areaArrayAtributoTemp.includes(area)) {
            arrayTempArea = [...arrayTempArea, usuario];
          }
        });
      });

      Usuarios = arrayTempArea;
    }

    return Usuarios;
  };

  filtrarUsuarios(usuarios, permiso, negocio, correo): any[] {
    // filtrado por permiso

    console.log(usuarios);
    if (permiso != null) {
      for (var i = 0; i < usuarios.Users.length; i++) {
        if (
          usuarios.Users[i]['Attributes'].find(
            (fruta) => fruta.Name === 'custom:rol'
          )
        ) {
          var atrPermiso = usuarios.Users[i]['Attributes'].find(
            (fruta) => fruta.Name === 'custom:rol'
          )['Value'];
          if (atrPermiso === permiso) {
            result.push(usuarios.Users[i]);
          }
        }
      }
    }
    // filtrado por negocio
    if (negocio != null) {
      for (var i = 0; i < usuarios.Users.length; i++) {
        if (
          usuarios.Users[i]['Attributes'].find(
            (fruta) => fruta.Name === 'custom:negocio'
          )
        ) {
          var atrNegocio = usuarios.Users[i]['Attributes'].find(
            (fruta) => fruta.Name === 'custom:negocio'
          )['Value'];
          if (atrNegocio === negocio) {
            result.push(usuarios.Users[i]);
          }
        }
      }
    }
    // filtrado por correo
    if (correo != null) {
      for (var i = 0; i < usuarios.Users.length; i++) {
        if (
          usuarios.Users[i]['Attributes'].find(
            (fruta) => fruta.Name === 'email'
          )
        ) {
          var atrCorreo = usuarios.Users[i]['Attributes'].find(
            (fruta) => fruta.Name === 'email'
          )['Value'];
          if (atrCorreo === correo) {
            result.push(usuarios.Users[i]);
          }
        }
      }
    }
    // distinct array result
    const map = new Map();
    for (const item of result) {
      if (!map.has(item.Username)) {
        map.set(item.Username, true);
        objFiltrado.push(item);
      }
    }
    console.log(JSON.stringify(objFiltrado));
    return objFiltrado;
  }
}
