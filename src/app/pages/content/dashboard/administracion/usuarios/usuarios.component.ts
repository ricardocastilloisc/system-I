import { LoadListaUsuarios, UnsetListaUsuarios } from './../../../../../ReduxStore/actions/listaUsuarios.actions';
import { AppState } from './../../../../../ReduxStore/app.reducers';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from '../../../../../services/usuarios.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit,OnDestroy {

  constructor(private store: Store<AppState>) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetListaUsuarios());
  }

  ngOnInit(): void {
    this.store
      .select(({ ListaUsuarios }) => ListaUsuarios.ListaUsuarios)
      .subscribe((res) => console.log(res));
    this.store.dispatch(LoadListaUsuarios());
  }
}
