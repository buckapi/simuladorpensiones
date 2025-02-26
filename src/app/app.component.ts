import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'simulator';

  constructor(
    public global: GlobalService) { }
}
