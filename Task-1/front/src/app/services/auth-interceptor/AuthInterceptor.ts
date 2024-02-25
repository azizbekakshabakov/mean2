import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/AuthService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExcludedPath(request.url)) {
      // If the URL matches an excluded path, proceed with the original request without adding any headers
      return next.handle(request);
    }
    if (this.authService.isAuthenticated()) {
      const authToken = this.authService.getToken();
      const authRequest = request.clone({
        setHeaders: {
          "x-auth-token": `${authToken}`
        }
      });
      return next.handle(authRequest);
    } else {
      console.log("askidfhuasiodufhaosidufjnalosidjfnaosidufhaosidufh777");
      window.location.href = '/login';
      return next.handle(request);
      this.router.navigate(['/login']);
      return next.handle(request);
    }
  }

  private isExcludedPath(url: string): boolean {
    // Add logic to check if the URL matches excluded paths
    // For example:
    return url.includes('/login') || url.includes('/register');
  }
}