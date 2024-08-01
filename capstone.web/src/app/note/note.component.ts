import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent {
  constructor(private userService: UserService) {}

  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }
}
