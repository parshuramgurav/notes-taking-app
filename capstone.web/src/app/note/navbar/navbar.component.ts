import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  username: string = 'Guest';
  isMenuOpen: boolean = false;



  constructor(private Shared: SharedService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem("Username") || 'Guest';
    console.log(this.username);
  }
  refresh() { window.location.reload() }

  view() {
    this.Shared.noteViewType.value === 'grid' ? this.Shared.noteViewType.next('list') : this.Shared.noteViewType.next('grid')
  }

  closeSideBar() { this.Shared.closeSideBar.next(true) }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
