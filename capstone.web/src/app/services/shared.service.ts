import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LabelsService } from './labels.service';
import { NotesService } from './notes.service';
import { createPopper } from '@popperjs/core';
import { NoteI, NoteModelI, UpdateKeyI } from '../interfaces/notes';
import { LabelI, LabelModelI } from '../interfaces/labels';
declare var Snackbar: any;

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private Notes: NotesService, private Labels: LabelsService) {
    this.get.notes();
    this.get.labels();
  }

  private get = {
    notes: () => {
      this.Notes.get();
      this.Notes.notesList$.subscribe({
        next: (result: NoteI[]) => {
          this.note.all = result.reverse();
          this.note.pinned = result.filter((note) => note.pinned);
          this.note.unpinned = result.filter((note) => !note.pinned);
        },
        error: (error: any) => console.error(error),
      });
    },
    labels: () => {
      this.Labels.get();
      console.log(this.Labels.get())
      this.Labels.labelsList$.subscribe({
        next: (result: LabelI[]) => { this.label.list = result.reverse() },
        error: (error: any) => console.error(error),
      });
    },
  };

  closeSideBar = new Subject<boolean>();
  saveNote = new Subject<boolean>();
  closeModal = new Subject<boolean>();
  noteViewType = new BehaviorSubject<'list' | 'grid'>('grid');

  note: NoteModelI = {
    id: -1,
    pinned: [],
    unpinned: [],
    all: [],
    operation: {
      add: async (data: NoteI) => {
        const id = await this.Notes.add(data);
        return id;
      },
      update: (object: UpdateKeyI, id: number) => this.Notes.update(object, id),
      trash: (id: number) => {
        this.Notes.delete(id);
        this.Labels.get();
        this.snackBar({ action: 'trashed', opposite: 'restored' }, { trashed: false }, id);
      },
      updateAllLabels: (id, value) => this.note.operation.updateAllLabels(id, value),
    },
  };


  label: LabelModelI = {
    id: -1,
    list: [],
    operation: {
      add: async (data: LabelI) => this.Labels.add(data),
      update: (data: LabelI) => this.Labels.update(data, this.label.id),
      delete: () => this.Labels.delete(this.label.id),
      updateAllLabels: (id, value) => this.note.operation.updateAllLabels(id, value),
    },
  };

  snackBar(text: { action: string; opposite: string }, obj: UpdateKeyI, noteId: number) {
    Snackbar.show({
      pos: 'bottom-left',
      text: `Note ${text.action}`,
      actionText: 'Undo',
      duration: 4200,
      onActionClick: () => {
        this.note.id = noteId;
        Snackbar.show({
          pos: 'bottom-left',
          text: `Note ${text.opposite}`,
          duration: 3000,
        });
      },
    });
  }

  createTooltip(button: HTMLDivElement, tooltipEl: HTMLDivElement) {
    tooltipEl.dataset['isTooltipOpen'] = 'true';
    createPopper(button, tooltipEl);
    let fct = (event: Event) => {
      if (!(tooltipEl as any).contains(event.target)) {
        document.removeEventListener('mousedown', fct);
        tooltipEl.dataset['isTooltipOpen'] = 'false';
      }
    };
    document.addEventListener('mousedown', fct);
  }

  closeTooltip(tooltipEl: HTMLDivElement) {
    tooltipEl.dataset['isTooltipOpen'] = 'false';
  }
}