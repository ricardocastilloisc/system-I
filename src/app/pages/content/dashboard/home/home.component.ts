import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../services/auth.service';
import { AppState } from '../../../../ReduxStore/app.reducers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {

    this.store.select('usuario').subscribe( e =>{ console.log(e)})
  }

}
