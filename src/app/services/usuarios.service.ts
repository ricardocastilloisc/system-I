import { ProcesoTerminado } from './../ReduxStore/actions/loaderProcesoCambios.actions';
import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { AppState } from '../ReduxStore/app.reducers';
import { Store } from '@ngrx/store';
import { ERole, ENegocio, EArea } from '../validators/roles';
import { ConsultaUsuario } from '../ReduxStore/reducers';
import { ValorFiltrarGrupo } from '../validators/opcionesDeFiltroUsuarioAdmininistracion';
import { UsuarioListado } from '../model/usuarioLitsa.model';
import { AuthService } from './auth.service';
import { AuditoriaService } from './auditoria.service';
import { HttpHeaders } from '@angular/common/http';

AWS.config.update(environment.SESConfig);
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
let result = [];
let objFiltrado = [];

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  Roles = [ERole.Administrador, ERole.Monitor];

  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
    EArea.Soporte,
  ];

  Negocios = [
    ENegocio.Afore,
    ENegocio.Fondos,
  ];

  params = {
    GroupName:
      'Tesoreria' /* es un dato de entrada de la pantalla (grupo al que se agrega o remueve el usuario) */,
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en al user pool */,
  };

  paramsUser = {
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en al user pool */,
  };

  paramsGroups = {
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
  };

  paramsUserGroups = {
    GroupName: 'Tesoreria' /* es un dato de entrada de la pantalla */,
    Limit: environment.amplifyConfig.Auth.limit,
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
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
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
  };

  paramsGrupoUsuario = {
    Username:
      'azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja' /* identificador del usuario en el user pool */,
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
  };

  paramsDeleteUser = {
    Username:
      'azure_hgjelpfjjwxffms6_5oti6ydqcjh7jhjdxn9706cxf0' /* identificador del usuario en el user pool */,
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
  };
  numeroDeProcesos = 0;

  constructor(private store: Store<AppState>, private authService: AuthService, private auditoria: AuditoriaService) { }

  paramSignOut = {
    Username: this.authService.getToken() as string,
    UserPoolId: environment.amplifyConfig.Auth.userPoolId,
  };

  logout(): void {
    cognitoidentityserviceprovider.adminUserGlobalSignOut(this.paramSignOut, this.callbackAws);
  }

  eliminarUsuario(): void {
    // metodo para eliminar un usuario del user pool
    cognitoidentityserviceprovider.adminDeleteUser(this.paramsDeleteUser, this.callbackAws);
  }

  eliminarUsuarioPromesa = (Username) => {
    // metodo para eliminar un usuario del user pool
    const paramsDeleteUser = {
      Username: Username,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
    };
    return cognitoidentityserviceprovider.adminDeleteUser(paramsDeleteUser).promise();
  }

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
      Limit: environment.amplifyConfig.Auth.limit,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
    };
    return cognitoidentityserviceprovider.listUsersInGroup(params);
  }

  consultarUsuarios = () => {
    // metodo para consultar todos los usuarios del user pool
    return cognitoidentityserviceprovider.listUsers(this.paramsGroups);
  }

  consultaSinFiltroYConFiltro = (consulta: ConsultaUsuario | null) => {
    let promesa = this.consultarUsuarios();
    if (consulta) {
      switch (consulta.tipo) {
        case ValorFiltrarGrupo.Grupo:
          promesa = this.consultarUsuariosEnGrupo(consulta.parametro);
      }
    }
    return promesa.promise();
  }

  consultaUsuariosMultipleFactor = (parametro) => {
    return new Promise((resolve) => {
      let ObjectUsers = [];
      let UserList = [];
      this.consultaSinFiltroYConFiltro(parametro).then(({ Users }) => {
        for (let i in Users) {
          if (Users[i].UserStatus === 'EXTERNAL_PROVIDER') {
            ObjectUsers.push(Users[i]);
          }
        }
        if (ObjectUsers.length === 0) {
          resolve(ObjectUsers);
        }
        const flagDeTerminado = ObjectUsers.length;
        let comparacion = 0;
        ObjectUsers.forEach((UserElement, index) => {
          if (UserElement.UserStatus === 'EXTERNAL_PROVIDER') {
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
          }
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
  }

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
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
      Username: usuario,
    };
    // metodo para agregar a un usuario habilitado en el user pool a un grupo en especifico
    return cognitoidentityserviceprovider.adminAddUserToGroup(params).promise();
  }

  eliminarUsuarioGrupo(grupo, usuario) {
    const params = {
      GroupName: grupo,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
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

  eliminarYAgregarGrupo = (Grupo, Username, GrupoOriginal) => {

    const params = {
      GroupName: GrupoOriginal,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
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
  }

  agregarUsuarioGrupoCallback(grupo, usuario) {
    const params = {
      GroupName: grupo,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
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
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
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
  }

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

    let usuario = '';
    this.store.select(({ usuario }) => usuario.user.email).subscribe(res => {

      usuario = res;
    });

    const ObjectUsuarioString = {
      area: paramGrupo.Grupo,
      permiso: Attributos.UserAttributes.find(el => el.Name === 'custom:rol')['Value'],
      negocio: Attributos.UserAttributes.find(el => el.Name === 'custom:negocio')['Value']
    };

    localStorage.setItem('ObjectNewUser', JSON.stringify(ObjectUsuarioString));

    this.generarAuditoria();

  }

  generarAuditoria(): void {

    const userOld = localStorage.getItem('ObjectOldUser');
    const userNew = localStorage.getItem('ObjectNewUser');

    const dataUsuario = JSON.parse(localStorage.getItem('ObjectDataUser'));
    const today = new Date().toISOString();

    let area: String = '';
    let rol = '';
    let correo = '';
    let apellidoPaterno = '';
    let nombre = '';

    this.store.select(({ usuario }) => usuario.user).subscribe(res => {
      rol = res.attributes['custom:rol'];
      correo = res.email;
      nombre = res.attributes.given_name;
      apellidoPaterno = res.attributes.family_name;
    });
    this.store.select(({ usuario }) => usuario.area).subscribe(res => {
      area = res;
    });

    let payload = {
      areaNegocio: area,
      rol: rol,
      correo: correo,
      fecha: today,
      modulo: "USUARIOS",
      usuario: {
        apellidoPaterno: apellidoPaterno,
        nombre: nombre
      },
      permisosUsuarios: [{
        nombre: dataUsuario.nombre,
        apellidoPaterno: dataUsuario.apellidoPaterno,
        correo: dataUsuario.usuario,
        accion: dataUsuario.accion,
        estado: "EXITO",
        detalleModificaciones: [{
          valorAnterior: JSON.parse(userOld),
          valorNuevo: JSON.parse(userNew)
        }]
      }]
    };

    const payloadString = JSON.stringify(payload);

    this.auditoria.enviarBitacoraUsuarios(payloadString);

    localStorage.removeItem('ObjectOldUser');
    localStorage.removeItem('ObjectNewUser');
    localStorage.removeItem('ObjectDataUser');
  }

  actualizarAtributosUsuario = (UserAttributes, Username) => {
    // metodo para actualizar los valores de los atributos del usuario en el user pool

    const paramsAtributos = {
      UserAttributes: UserAttributes,
      Username: Username /* identificador del usuario en el user pool */,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
    };
    return cognitoidentityserviceprovider
      .adminUpdateUserAttributes(paramsAtributos)
      .promise();
  }

  obtenerGrupoUsuarioPromise = (usuario) => {
    let params = {
      Username: usuario /* identificador del usuario en el user pool */,
      UserPoolId: environment.amplifyConfig.Auth.userPoolId,
    };
    return cognitoidentityserviceprovider
      .adminListGroupsForUser(params)
      .promise();
  }

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
      .subscribe((res: any) => {
        if (res) {
          if (res.hasOwnProperty('groups')) {
            if (this.Areas.some( ai => res.groups.includes(ai) )) {
              const { attributes } = res;
              if (attributes.hasOwnProperty('custom:rol') && attributes.hasOwnProperty('custom:negocio')) {
                if (this.Roles.includes(attributes['custom:rol']) && this.Negocios.some( ai => attributes['custom:negocio'].includes(ai))) {
                  flagValidate = true;
                }
              }
            }
          }
        }
      });
    return flagValidate;
  }

  callbackAws = (err, data) => {
  }

  callbackAwsDetalle = (err, data) => {
  }

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
  }

  filtrarUsuariosConAtributos = (
    usuarios: UsuarioListado[],
    permiso,
    areas,
    Correo
  ) => {
    let Usuarios = [...usuarios];

    if (Correo != null) {
      let arrayTempCorreo = [];
      Correo.forEach((Correo) => {
        arrayTempCorreo = [
          ...arrayTempCorreo,
          ...Usuarios.filter((e) => e.Attributes['email'] === Correo),
        ];
      });
      Usuarios = arrayTempCorreo;
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
  }

  filtrarUsuarios(usuarios, permiso, negocio, correo): any[] {

    if (permiso != null) {
      for (var i = 0; i < usuarios.Users.length; i++) {
        if (
          usuarios.Users[i]['Attributes'].find(
            (elemento) => elemento.Name === 'custom:rol'
          )
        ) {
          var atrPermiso = usuarios.Users[i]['Attributes'].find(
            (elemento) => elemento.Name === 'custom:rol'
          )['Value'];
          if (atrPermiso === permiso) {
            result.push(usuarios.Users[i]);
          }
        }
      }
    }
    if (negocio != null) {
      for (var i = 0; i < usuarios.Users.length; i++) {
        if (
          usuarios.Users[i]['Attributes'].find(
            (elemento) => elemento.Name === 'custom:negocio'
          )
        ) {
          var atrNegocio = usuarios.Users[i]['Attributes'].find(
            (elemento) => elemento.Name === 'custom:negocio'
          )['Value'];
          if (atrNegocio === negocio) {
            result.push(usuarios.Users[i]);
          }
        }
      }
    }
    if (correo != null) {
      for (var i = 0; i < usuarios.Users.length; i++) {
        if (
          usuarios.Users[i]['Attributes'].find(
            (elemento) => elemento.Name === 'email'
          )
        ) {
          var atrCorreo = usuarios.Users[i]['Attributes'].find(
            (elemento) => elemento.Name === 'email'
          )['Value'];
          if (atrCorreo === correo) {
            result.push(usuarios.Users[i]);
          }
        }
      }
    }
    const map = new Map();
    for (const item of result) {
      if (!map.has(item.Username)) {
        map.set(item.Username, true);
        objFiltrado.push(item);
      }
    }
    return objFiltrado;
  }

}
