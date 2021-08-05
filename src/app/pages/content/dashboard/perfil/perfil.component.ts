import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/model/usuario.model';
import { AppState } from 'src/app/ReduxStore/app.reducers';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  DataUser$: Observable<Usuario>;

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {

    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
  }

  obtenerArea(): any {
    let area: String = '';
    this.store
      .select(({ usuario }) => usuario.area)
      .subscribe((res) => {
        area = res;
      });
    return area;
  }

}
