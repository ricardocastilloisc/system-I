import { unSetnotificaciones } from './../../../ReduxStore/actions/notificaciones.actions';
import { UsuariosService } from './../../../services/usuarios.service';
import { rutasConNombres } from './../../../helpers/rutas';
import { AfterViewInit, Component, HostListener, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private router: Router
  ) {}
  ngOnDestroy(): void {
   this.store.dispatch(unSetnotificaciones())
  }

  ngAfterViewInit(): void {
    this.resizeMenuContent();
    //this.getRuta();
  }

  arrayRuta = () => {
    let ArrayRuta = [];

    window.location.pathname.split('/').forEach((elementoRuta) => {
      let coincidencia = false;
      rutasConNombres.forEach((elementoValidar) => {
        if (elementoRuta === elementoValidar.rutaAngular) {
          coincidencia = true;
          ArrayRuta.push(elementoValidar.ValorEsp);
        }
      });

      if (!coincidencia && elementoRuta !== '') {

        ArrayRuta.push(elementoRuta.split('%20').join(' ').toString());
        
      }
    });

    return ArrayRuta;
  };

  retornarColor = (ArrayRuta) => {
    let nombreRuta = ArrayRuta.join('/').toString();

    let returnColor = '';
    //console.log(nombreRuta);
    if (nombreRuta.includes('Administración')) {
      returnColor = 'verde';
    } else if (nombreRuta.includes('Procesos')) {
      returnColor = 'morado';
    } else if (nombreRuta.includes('Auditoría')) {
      returnColor = 'azul';
    } else {
      returnColor = 'verde';
    }
    return returnColor;
  };

  retornarClaseCorrecta = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'alineadoTextoIzquierda';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'alineadoTextoIzquierdaMorado';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'alineadoTextoIzquierdaAzul';
    }
  };

  retornarClaseCorrectaDrecha = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'alineadoTextoDerecha';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'alineadoTextoDerechaMorado';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'alineadoTextoDerechaAzul';
    }
  };

  retornarClaseCorrectaLinea = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'linea';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'linea-morado';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'linea-azul';
    }
  };

  retornarIconoCorrecto = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'assets/icons/nav/inicio.svg';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'assets/icons/nav/procesos.svg';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'assets/icons/nav/auditoria.svg';
    }
  };

  colorCamppanaCorrecto = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return '#00c4d9';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return '#7c69c3';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return '#0091da';
    }
  };
  irRutaDeStringRuta = (index) => {
    const ArrayUrl = window.location.pathname.split('/');

    let url = '';

    if (index === 0) {
      for (let i = 1; i < index + 3; i++) {
        url = url + '/' + ArrayUrl[i];
      }
    } else {
      for (let i = 1; i < index + 2; i++) {
        url = url + '/' + ArrayUrl[i];
      }
    }
    this.router.navigateByUrl(url);
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
  }

  signOut = () => {
    localStorage.setItem("SIA", "false");
    this.authService.signOut();
    this.usuario.logout();
  };

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  };

  perfilValido = (User: Usuario, roles: any[]): boolean => {
    return this.authService.perfilValido(User, roles);
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
    let area: String = '';
    this.store
      .select(({ usuario }) => usuario.area)
      .subscribe((res) => {
        //console.log(res);
        area = res;
      });
    return area;
  }
}
