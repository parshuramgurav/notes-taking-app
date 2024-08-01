import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotesComponent } from './notes/notes.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { InputComponent } from './input/input.component';
import { MainComponent } from './main/main.component';
import { NoteComponent } from './note.component';
import { NotesToolsPipe } from '../pipes/notes-tools.pipe';
import { ph } from '../pipes/ph.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoteRoutingModule } from './note-routing.module';

@NgModule({
  declarations: [
    NavbarComponent,
    SidenavComponent,
    InputComponent,
    MainComponent,
    NotesComponent,
    NoteComponent,
    NotesToolsPipe,
    ph,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    NoteRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [NoteComponent]
})
export class NoteModule { }