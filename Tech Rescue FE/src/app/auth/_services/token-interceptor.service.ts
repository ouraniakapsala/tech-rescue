import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable(
// {providedIn: 'root',}
)
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService,) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    // console.log('TokenInterceptor called');
    // console.log('Request URL:', req.url);
    // console.log('Token:', token);
    // console.log('TokenInterceptor attaching token:', token);

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      // console.log('Cloned request headers:', cloned.headers.keys());
      // console.log('Authorization header value:', cloned.headers.get('Authorization'));
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
