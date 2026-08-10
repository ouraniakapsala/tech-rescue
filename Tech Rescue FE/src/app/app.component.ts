import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';
// import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Demo';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const isAuth = event.urlAfterRedirects.startsWith('/auth');
      if (isAuth) {
        document.body.classList.add('nb-theme-default');
      } else {
        document.body.classList.remove('nb-theme-default');
      }
    });
  }

  ngAfterViewInit(): void {
  }

  isLoginPage(): boolean {
    return this.router.url === '/' || this.router.url === '/login' || this.router.url === '/auth/login';
  }

  ngOnInit(): void {
  }
}
