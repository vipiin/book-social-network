import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  istokenNotValid() {
    return !this.isTokenValid();
  }
  isTokenValid() {
    const token: string = this.token;
    if (!token) {
      return false;
    }
    //decode the token
    const jwtHelper = new JwtHelperService();
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  }
  private platformId = inject(PLATFORM_ID);

  set token(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  get token() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') as string;
    }
    return '';
  }
}
