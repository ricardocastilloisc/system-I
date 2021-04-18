import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
declare var $:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signOut = () =>
  {
    this.authService.signOut();
  }


  toggle = () =>{
    $("#sidebar").toggleClass("active");
  }

}
