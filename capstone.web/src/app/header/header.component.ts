import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private userService: UserService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
