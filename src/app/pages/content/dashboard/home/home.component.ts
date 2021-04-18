import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }
  ngAfterViewInit(): void {
    window.history.replaceState(null, null, window.location.pathname);
  }



  ngOnInit(): void {
  }

}
