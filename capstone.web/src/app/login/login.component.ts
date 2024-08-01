import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  passwordHash: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  errorMessage: string = '';
  isRegister: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  login(): void {
    this.userService.login(this.username, this.passwordHash).subscribe(
      (response: { token: string; }) => {
        this.userService.setToken(response.token);
        localStorage.setItem("Username", this.username);
        this.router.navigate(['/']);
      },
      (error: any) => {
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }

  register(): void {
    this.userService.register(
      this.username,
      this.passwordHash,
      this.firstName,
      this.lastName,
      this.email,
    ).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
        this.toggleRegister();
      },
      (error: any) => {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  toggleRegister() {
    this.isRegister = !this.isRegister;
  }
}