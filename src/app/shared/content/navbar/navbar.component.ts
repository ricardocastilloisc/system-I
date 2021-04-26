import { rutasConNombres } from './../../../helpers/rutas';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../../../ReduxStore/app.reducers';
import { Usuario } from '../../../model/usuario.model';
import { Observable } from 'rxjs';
import { ERole } from '../../../validators/roles';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
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
    private rutaActiva: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    this.resizeMenuContent();
    this.getRuta();
  }

  getRuta = () => {
    let ArrayRuta =  [];
     window.location.pathname.split('/').map((elementoRuta) => {
      rutasConNombres.forEach((elementoValidar) => {
        if(elementoRuta === elementoValidar.rutaAngular){
          ArrayRuta.push(elementoValidar.ValorEsp);
        }
      });
    });
    let nombreRuta = ArrayRuta.join('/').toString();
    return nombreRuta.length>0?nombreRuta:'Inicio';
  };


  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
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
