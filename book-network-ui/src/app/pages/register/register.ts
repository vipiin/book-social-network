import { Component,ChangeDetectorRef } from '@angular/core';
import { RegistrationRequest } from '../../services/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerRequest: RegistrationRequest = {email:'',firstname:'',lastname:'',password:''};
  errorMsg: Array<string>=[];


  constructor(
    private router:Router,
    private authService:AuthenticationService,
    private cdr:ChangeDetectorRef
  ){

  }
  login() {
this.router.navigate(['login']);
}
register() {
  this.errorMsg=[];
  this.authService.register({
    body: this.registerRequest
  }).then((res)=>{
    this.router.navigate(['activate-account']);
  }
  ).catch((error)=>{
    console.log(error.error);
    if (error.error && error.error.businessErrorDescription) {
          this.errorMsg=error.error.businessErrorDescription;
        } else if(error.error && error.error.validationErrors){
    this.errorMsg=error.error.validationErrors;
        }
        
     this.cdr.detectChanges();
  })
}
}
