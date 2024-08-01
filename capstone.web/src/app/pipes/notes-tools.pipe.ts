import { Pipe, PipeTransform } from '@angular/core';
import { NoteI } from '../interfaces/notes';

@Pipe({
  name: 'notesTools',
  // pure: false
})
export class NotesToolsPipe implements PipeTransform {

  transform(object: NoteI[], type: string): NoteI[] {
    console.log("Type:",type)
    console.log("Object:",object)
    if (type === 'trashed') {
      return object.filter(x => x.trashed === true)
    }
    else if (type === 'home') {
      return object.filter(x => x.trashed === false)
    }
    else {
      return object.filter(note => note.labels.some(label => label.name === type && label.added))
    }
  }

}
