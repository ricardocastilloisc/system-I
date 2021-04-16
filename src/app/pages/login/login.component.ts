import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  login = () => {
    window.location.assign(
      'https://auth-335672086802-us-east-1.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=jll4ul3pmr6rb37i0fmtmctf&redirect_uri=http://localhost:4200/dashboard'
    );
        /*this.router.navigate(['/dashboard']);*/
  }
}
