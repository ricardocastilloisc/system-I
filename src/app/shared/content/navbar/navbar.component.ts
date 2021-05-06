import { UsuariosService } from './../../../services/usuarios.service';
import { rutasConNombres } from './../../../helpers/rutas';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../../../ReduxStore/app.reducers';
import { Usuario } from '../../../model/usuario.model';
import { Observable } from 'rxjs';
import { ERole } from '../../../validators/roles';
declare var $: any;

let color = '';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent implements OnInit, AfterViewInit {
  @HostListener('window:resize', ['$event'])

  onResize() {
    this.resizeMenuContent();
  }

  DataUser$: Observable<Usuario>;  

  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private usuario: UsuariosService
  ) { }

  ngAfterViewInit(): void {
    this.resizeMenuContent();
    //this.getRuta();
  }

  getRuta = () => {
    let ArrayRuta = [];
    window.location.pathname.split('/').map((elementoRuta) => {
      rutasConNombres.forEach((elementoValidar) => {
        if (elementoRuta === elementoValidar.rutaAngular) {
          ArrayRuta.push(elementoValidar.ValorEsp);
        }
      });
    });
    let nombreRuta = ArrayRuta.join('/').toString();
    console.log(nombreRuta);
    if (nombreRuta.includes('Administración')) {
      color = 'verde';
    } else if (nombreRuta.includes('Procesos')) {
      color = 'morado';
    } else if (nombreRuta.includes('Auditoría')) {
      color = 'azul';
    }
    console.log(color);
    return nombreRuta.length > 0 ? nombreRuta : 'Inicio';
  };

  morado = () => {
    let mor = true;
    return mor;
  };

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.getRuta();
  }

  signOut = () => {
    this.authService.signOut();
  };

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };

  toggle = () => {
    $('#sidebar').toggleClass('active');
    this.resizeMenuContent();
  };

  resizeMenuContent = () => {
    if (window.innerWidth < 769) {
      if ($('#sidebar').hasClass('active')) {
        $('#content').css('margin-left', '253px');
        $('#headernav').css('width', window.innerWidth + 'px');
      } else {
        $('#content').css('margin-left', '0px');
        $('#headernav').css('width', '100%');
      }
    } else {
      if ($('#sidebar').hasClass('active')) {
        $('#content').css('margin-left', '0px');
        $('#headernav').css('width', '100%');
      } else {
        $('#content').css('margin-left', '253px');
        $('#headernav').css('width', window.innerWidth - 253 + 'px');
      }
    }
  };
}
