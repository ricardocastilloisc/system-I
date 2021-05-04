import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { ERole } from 'src/app/validators/roles';

var users = {
  "Users": [{
    "Username": "azure_py5dp6qycyodowdb_ebampy3af9cv6io1-k6uek6a-4",
    "Attributes": [{
      "Name": "sub",
      "Value": "427f0e89-dd0a-48be-927d-8f8c0e938d57"
    }, {
      "Name": "identities",
      "Value": "[{\"userId\":\"PY5dp6qYCyodowdB_EBAmPy3aF9cV6iO1-k6Uek6A-4\",\"providerName\":\"Azure\",\"providerType\":\"OIDC\",\"issuer\":null,\"primary\":true,\"dateCreated\":1620096467207}]"
    }, {
      "Name": "email_verified",
      "Value": "false"
    }, {
      "Name": "name",
      "Value": "Garcia, Diego  - C"
    }, {
      "Name": "given_name",
      "Value": "Diego"
    }, {
      "Name": "family_name",
      "Value": "Garcia"
    }, {
      "Name": "email",
      "Value": "garcia.diego@principal.com"
    }],
    "UserCreateDate": "2021-05-04T02:47:47.213Z",
    "UserLastModifiedDate": "2021-05-04T04:56:14.561Z",
    "Enabled": true,
    "UserStatus": "EXTERNAL_PROVIDER"
  }, {
    "Username": "azure_rwayeowx9nsigogmrb6adqmpgrl2hohoivn5bgsobja",
    "Attributes": [{
      "Name": "sub",
      "Value": "461ae8ff-f50c-447c-b3c7-9627326f4e1b"
    }, {
      "Name": "identities",
      "Value": "[{\"userId\":\"RwAYeoWx9NsigogmRB6AdQMPgRl2hOHOivN5bGsObjA\",\"providerName\":\"Azure\",\"providerType\":\"OIDC\",\"issuer\":null,\"primary\":true,\"dateCreated\":1620104207730}]"
    }, {
      "Name": "email_verified",
      "Value": "false"
    }, {
      "Name": "name",
      "Value": "Galicia, Brenda  - C"
    }, {
      "Name": "custom:negocio",
      "Value": "Afore"
    }, {
      "Name": "custom:rol",
      "Value": "Soporte"
    }, {
      "Name": "given_name",
      "Value": "Brenda"
    }, {
      "Name": "family_name",
      "Value": "Galicia"
    }, {
      "Name": "email",
      "Value": "galicia.brenda@principal.com"
    }],
    "UserCreateDate": "2021-05-04T04:56:47.737Z",
    "UserLastModifiedDate": "2021-05-04T15:08:06.904Z",
    "Enabled": true,
    "UserStatus": "EXTERNAL_PROVIDER"
  }]
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  DataUser$: Observable<Usuario>;
  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  constructor(
    private store: Store<AppState>,
    private usuario: UsuariosService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.usuario.obtenerDetalleUsuario();
    /*
    console.log('¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡')
    console.log(this.usuario.filtrarUsuarios(users, 'Soporte', 'Afore', 'galicia.brenda@principal.com'));
    console.log('¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡')
    */
  }

  rolesValids = (User:Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids( User, roles);
  };

}
