import { NoteI, UpdateKeyI } from './../interfaces/notes';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private BASE_URL = environment.BASE_URL;

  private notesListSubject = new BehaviorSubject<NoteI[]>([]);
  notesList$: Observable<NoteI[]> = this.notesListSubject.asObservable();

  constructor(private http: HttpClient) { }

  private updateNotesList(notes: NoteI[]) {
    this.notesListSubject.next(notes);
  }

  async get() {
    try {
      const response = await this.http.get<NoteI[]>(`${this.BASE_URL}/notes`).toPromise();
      if (response) {
        this.updateNotesList(response);
      }
    }
    catch (error) {
      console.log(console.error);
    }
  }

  async add(noteObj: NoteI) {
    try {
      const response = await this.http.post<NoteI>(`${this.BASE_URL}/notes`, { ...noteObj, trashed: false }).toPromise();
      if (response) {
        this.updateNotesList([...this.notesListSubject.value, response]);
      }
    }
    catch (error) {
      console.log(console.error);
    }
  }

  async delete(id: number) {
    try {
      await this.http.patch<NoteI>(`${this.BASE_URL}/notes/${id}`, { trashed: true }).toPromise();
      this.updateNotesList(this.notesListSubject.value.filter((note: any) => note.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  async update(object: UpdateKeyI, id: number) {
    try {
      await this.http.patch<NoteI>(`${this.BASE_URL}/notes/${id}`, object).toPromise();
      const notes = this.notesListSubject.value.map((note: any) => {
        if (note.id === id) {
          return { ...note, ...object };
        }
        console.log("Updated",object)
        return note;
      });
      this.updateNotesList(notes);
    } catch (error) {
      console.log(error);
    }
  }
}