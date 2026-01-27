import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { AuthenticationRequest } from '../../services/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/services';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token/token';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {


  authRequest: AuthenticationRequest = {
    email: '',
    password: ''
  };
  errorMsg: Array<string> = [];
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    if (this.tokenService.isTokenValid()) {
      this.router.navigate(['books']);
    }
  }
  login() {
    this.errorMsg = [];
    this.authService.authenticate(
      {
        body: this.authRequest
      }
    ).then((res) => {
      this.tokenService.token = res.token as string;
      this.router.navigate(['books']);
    }).catch((error) => {
      console.log(error);
      if (error.error && error.error.validationErrors) {
        this.errorMsg = error.error.validationErrors;
        console.log('Validation errors assigned:', this.errorMsg);
      } else {
        this.errorMsg = [];
        if (error.error && error.error.businessErrorDescription) {
          this.errorMsg.push(error.error.businessErrorDescription);
        } else if (error.error && error.error.error) {
          this.errorMsg.push(error.error.error);
        } else {
          this.errorMsg.push(error.message || 'Login failed');
        }
      }
      this.cdr.detectChanges();
    });
  }
  register() {
    this.router.navigate(['register']);
  }
}
