import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { CodeInputComponent } from 'angular-code-input';
import { CodeInputModule } from 'angular-code-input';
import { CommonModule } from '@angular/common';
import { error } from 'console';
@Component({
  selector: 'app-acivate-account',
  imports: [CodeInputModule,CommonModule],
  templateUrl: './acivate-account.html',
  styleUrl: './acivate-account.scss',
})
export class AcivateAccount {
  message='';
  isOkay=true;
  submitted=false;
  constructor(
    private router:Router,
    private authService:AuthenticationService,
    private cdr:ChangeDetectorRef
  ){

  }
  redirectToLogin() {
    this.router.navigate(['login']);
  }
  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }
  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).then((res)=>{
      this.message="Your account has been successfully activate.\nNow you can proceed to login";
      this.isOkay = true;
      this.submitted=true;
      this.cdr.detectChanges();
      console.log('Success:', this.isOkay, this.submitted);
    }).catch((error)=>{
      console.log(error);
      this.isOkay=false;
      this.message="Token has been expired or invalid";
      this.submitted=true;
      this.cdr.detectChanges();
      console.log('Error:', this.isOkay, this.submitted);
    });
  }
}
