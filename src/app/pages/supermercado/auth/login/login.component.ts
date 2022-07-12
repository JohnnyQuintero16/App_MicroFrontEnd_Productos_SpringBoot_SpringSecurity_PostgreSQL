import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginUsuarioDto } from 'src/app/models/LoginUsuarioDto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  isLogged = false;
  isLoginFail = false;
  loginUsuarioDto : LoginUsuarioDto;
  username: string;
  password: string;
  roles: string[] = [];
  errMsj: string;


  constructor(
    private tokenService: TokenService,
    private authService : AuthService,
    private router: Router,
    private toast: NgToastService,
    private ngxService: NgxUiLoaderService
  ) {

  }

  ngOnInit(){
     //---------- Check Logueo ------------
     if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }



  onLogin(): void {

        //SPIN LOADING
        this.ngxService.start();
        setTimeout(() => {
          this.ngxService.stop();
        }, 300);
        //FIN SPIN LOADING


        //LOGIN AND TOASTS
  setTimeout(() => {
    this.loginUsuarioDto = new LoginUsuarioDto(this.username, this.password);
    this.authService.login(this.loginUsuarioDto).subscribe(
      data => {

        this.isLogged = true;
        this.isLoginFail=false;

        this.tokenService.setToken(data.token);
        this.tokenService.setUsername(data.username);
        this.tokenService.setAuthorities(data.authorities);

        this.roles = data.authorities;

        this.router.navigate(['/inicio']);

        this.toast.success({detail:"Credenciales Válidas",summary:'Bienvenido/a!', duration:2000});

        window.setTimeout(function(){location.reload()},2000)

        console.log('logueado');
      },

      err => {

        this.isLogged = false;
        this.isLoginFail=true;

        this.errMsj = err.error.message;

          //SPIN LOADING
          this.ngxService.start();
          setTimeout(() => {
            this.ngxService.stop();
          }, 100);
          //FIN SPIN LOADING

          //TOAST ERROR
      setTimeout(() => {
        this.toast.error({detail:"ERROR",summary:this.errMsj , duration:2000});
      }, 200);
      //FIN TOAST ERROR

        console.log(this.errMsj);
      },
    );
  }, 600);
  //FIN LOGIN AND TOASTS
  }

}


