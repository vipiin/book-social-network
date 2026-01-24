import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../services/token/token';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  tokenService = inject(TokenService);
  readonly routerLinkActiveOptions = { exact: true };
  username = signal<string>('');
  ngOnInit(): void {
    const token = this.tokenService.token;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload); // Useful for debugging claim names
        const name = payload.fullName || payload.username || payload.sub || payload.preferred_username || 'User';
        this.username.set(name);
      } catch (e) {
        console.error('Error parsing token', e);
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }
}
