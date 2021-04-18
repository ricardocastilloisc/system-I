import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  constructor(private authService: AuthService) { }
  ngAfterViewInit(): void {
    this.authService.initAuthData();
  }
}
