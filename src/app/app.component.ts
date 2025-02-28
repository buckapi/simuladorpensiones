import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GlobalService } from './services/global.service';
import { HeaderComponent } from './components/ui/header/header.component';
import { Home2Component } from './components/home2/home2.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    Home2Component
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'simulator';

  constructor(
    public global: GlobalService) { }
}
