import {
  LoadListaUsuarios,
  UnsetListaUsuarios,
} from './../../../../../ReduxStore/actions/listaUsuarios.actions';
import { AppState } from './../../../../../ReduxStore/app.reducers';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UsuarioListado } from 'src/app/model/usuarioLitsa.model';
import { retornarStringSiexiste } from '../../../../../helpers/FuncionesUtiles';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  ListadoUsuarios$: Observable<UsuarioListado[]>;

  constructor(private store: Store<AppState>) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetListaUsuarios());
  }

  ngOnInit(): void {
    this.ListadoUsuarios$ = this.store.select(
      ({ ListaUsuarios }) => ListaUsuarios.ListaUsuarios
    );
    this.store.dispatch(LoadListaUsuarios());
  }

  retornarStringSiexiste = (object, attribute) => {
    return retornarStringSiexiste(object, attribute)
  }
}
