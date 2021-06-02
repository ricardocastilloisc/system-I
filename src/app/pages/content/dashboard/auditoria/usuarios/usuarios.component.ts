import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadAUDGENUSUARIOS, UnsetAUDGENUSUARIO  } from './../../../../../ReduxStore/actions/usuarios/AUDGENUSUARIOS.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, Subscription } from 'rxjs';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/AUDGENUSUARIO.model';
import { APIService } from '../../../../../API.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private api: APIService
  ) {}

  AUDGENUSUARIOS$: Observable<AUDGENUSUARIO_INTERFACE[]>;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENUSUARIO());
  }

  ngOnInit(): void {


    this.AUDGENUSUARIOS$ = this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })

    }
    ))

    this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).subscribe(res => { console.log(res)})

    let body = {
      MODULO: { eq: 'USUARIOS' } 
    }
    
    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'USUARIOS'}}));

    this.api.ListAUDGENUSUARIOS('USUARIOS').then(res => {
      console.log(res)
    })
  }

  
}
