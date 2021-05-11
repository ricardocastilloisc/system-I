import { UsuariosService } from './../../../services/usuarios.service';
import { rutasConNombres } from './../../../helpers/rutas';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../../../ReduxStore/app.reducers';
import { Usuario } from '../../../model/usuario.model';
import { Observable } from 'rxjs';
import { ERole } from '../../../validators/roles';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { map } from 'rxjs/operators';
import { NOTIFICACION_INTERFACE } from './../../../model/notificacion.model';
import { Router } from '@angular/router';

declare var $: any;

let color = 'verde';

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
  Monitor = ERole.Monitor;
  Soporte = ERole.Soporte;
  Notificaciones$: Observable<NOTIFICACION_INTERFACE[]>;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private usuario: UsuariosService,
    private NotificacionesService: NotificacionesService,
    private router: Router,
  ) { }

  ngAfterViewInit(): void {
    this.resizeMenuContent();
    //this.getRuta();
  }

  arrayRuta =  () => {
    let ArrayRuta = [];

    window.location.pathname.split('/').forEach((elementoRuta) => {
      rutasConNombres.forEach((elementoValidar) => {
        if (elementoRuta === elementoValidar.rutaAngular) {
          ArrayRuta.push(
            elementoValidar.ValorEsp
            );
        }
      });
    });



    let nombreRuta = ArrayRuta.join('/').toString();
    //console.log(nombreRuta);
    if (nombreRuta.includes('Administración')) {
      color = 'verde';
    } else if (nombreRuta.includes('Procesos')) {
      color = 'morado';
    } else if (nombreRuta.includes('Auditoría')) {
      color = 'azul';
    } else{
      color = 'verde';
    }

    return ArrayRuta
  }

  irRutaDeStringRuta = (index) => {

    const ArrayUrl = window.location.pathname.split('/');

    let url = '';

    if(index === 0){
      for (let i = 1; i < index+3; i++) {
        url = url + '/' + ArrayUrl[i]
      }
    }else{
      for (let i = 1; i < index+2; i++) {
        url = url + '/' + ArrayUrl[i]
      }
    }
    this.router.navigateByUrl(url)
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
    //console.log(nombreRuta);
    if (nombreRuta.includes('Administración')) {
      color = 'verde';
    } else if (nombreRuta.includes('Procesos')) {
      color = 'morado';
    } else if (nombreRuta.includes('Auditoría')) {
      color = 'azul';
    } else{
      color = 'verde';
    }
    //console.log(color);
    return nombreRuta.length > 0 ? nombreRuta : 'Inicio';
  };

  estiloVerde = () => {
    let verde = false;
    if (color === 'verde') {
      verde = true;
    }
    //console.log('estilo verde: ' + color);
    return verde;
  };

  estiloMorado = () => {
    let morado = false;
    if (color === 'morado') {
      morado = true;
    }
    //console.log('estilo morado: ' + color);
    return morado;
  };

  estiloAzul = () => {
    let azul = false;
    if (color === 'azul') {
      azul = true;
    }
    //console.log('estilo azul: ' + color);
    return azul;
  };

  eliminarNotificacion = (ID_PROCESO: string) => {
    this.NotificacionesService.eliminarNoticiaciones(ID_PROCESO);
    $('#dLabel').click();
  };

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.Notificaciones$ = this.store
    .select(({ notificaciones }) => notificaciones.notificaciones)
    .pipe(map((e) => e.filter((fl) => fl.LEIDO === false)));

  this.getRuta();
    this.getRuta();
  }

  signOut = () => {
    this.authService.signOut();
  };

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };


  perfilValido= (User:Usuario, roles: any[]): boolean => {
    return this.authService.perfilValido( User, roles);
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


  obtenerArea(): any {
    //console.log('obtenerArea');
    let area:String = '';
    this.store.select(({ usuario }) => usuario.area).subscribe(res => {
      //console.log(res);
      area = res;
    });
    return area;
  };
}
