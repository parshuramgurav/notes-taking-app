import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LabelI, LabelModelI } from '../../interfaces/labels';
import { bgImages, bgColors } from '../../interfaces/tooltip'
import { ph } from '../../pipes/ph.pipe';
import { NoteI, CheckboxI } from '../../interfaces/notes';
import { LabelsService } from '../../services/labels.service';

type InputLengthI = { title?: number, body?: number, cb?: number }

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements OnInit {
  @ViewChild("main") main!: ElementRef<HTMLDivElement>
  @ViewChild("notePlaceholder") notePlaceholder!: ElementRef<HTMLDivElement>
  @ViewChild("noteMain") noteMain!: ElementRef<HTMLDivElement>
  @ViewChild("noteContainer") noteContainer!: ElementRef<HTMLDivElement>
  @ViewChild("noteTitle") noteTitle!: ElementRef<HTMLDivElement>
  @ViewChild("noteBody") noteBody?: ElementRef<HTMLDivElement>
  @ViewChild("notePin") notePin!: ElementRef<HTMLDivElement>
  @ViewChild("moreMenuTtBtn") moreMenuTtBtn?: ElementRef<HTMLDivElement>
  @Input() isEditing = false
  @Input() noteToEdit: NoteI = {} as NoteI

  labels: LabelI[] = []
  isTrashed = false
  bgColors = Object.entries(bgColors);
  bgImages = Object.entries(bgImages);
  inputLength = new BehaviorSubject<InputLengthI>({ title: 0, body: 0, cb: 0 })
  moreMenuEls = {
    delete: {
      disabled: true,
    }
  }
  constructor(private cd: ChangeDetectorRef, public Shared: SharedService, public Labels: LabelsService) { }


  toggleNoteVisibility(condition: boolean) {
    if (condition) {
      this.notePlaceholder.nativeElement.hidden = true; this.noteMain.nativeElement.hidden = false
    } else {
      this.notePlaceholder.nativeElement.hidden = false; this.noteMain.nativeElement.hidden = true
    }
  }

  notePhClick() {
    this.toggleNoteVisibility(true);
    this.noteBody?.nativeElement.focus();
    if (!this.isEditing) {
      this.inputLength.next({ title: 0, body: 0, cb: 0 })
      document.addEventListener('mousedown', this.mouseDownEvent)
    }
  }

  mouseDownEvent = (event: Event) => {
    if (this.isEditing) return
    let el = this.main.nativeElement
    let isTooltipOpen: any = document.querySelector('[data-is-tooltip-open="true"]')
    if (isTooltipOpen !== null) {
      if (!(el as any).contains(event.target) && !isTooltipOpen.contains(event.target)) { }
    }
    else if (!(el as any).contains(event.target)) {
      this.saveNote(); this.closeNote()
    }
  }

  closeNote() {
    this.toggleNoteVisibility(false)
    document.removeEventListener('mousedown', this.mouseDownEvent)
    this.reset()
  }

  async saveNote() {
    let noteObj: NoteI = {
      noteTitle: this.noteTitle.nativeElement.innerHTML,
      noteBody: this.noteBody?.nativeElement?.innerHTML || '',
      pinned: this.notePin.nativeElement.dataset['pinned'] === "true",
      bgColor: this.noteMain.nativeElement.style.backgroundColor.trim() == '' ? '#fff' : this.noteMain.nativeElement.style.backgroundColor,
      bgImage: this.noteContainer.nativeElement.style.backgroundImage,
      labels: this.labels.filter((x) => x.added),
      trashed: this.isTrashed,
    };
    if (noteObj.noteTitle.length || (noteObj.noteBody && noteObj.noteBody.length)) {
      if (this.isEditing) {
        this.Shared.note.operation.update(noteObj, this.Shared.note.id);
        this.Shared.closeModal.next(true);
      } else {
        let id = await this.Shared.note.operation.add(noteObj);
        if (this.isTrashed) {
          this.Shared.snackBar({ action: 'trashed', opposite: 'untrashed' }, { trashed: false }, id);
        }
        this.closeNote();
      }
    }
  }

  reset() {
    if (this.noteTitle) this.noteTitle.nativeElement.innerHTML = ''
    if (this.noteBody) this.noteBody.nativeElement.innerHTML = ''
    this.notePin.nativeElement.dataset['pinned'] = 'false'
    this.noteContainer.nativeElement.style.backgroundImage = ''
    this.noteMain.nativeElement.style.backgroundColor = ''
    this.noteMain.nativeElement.style.borderColor = ''
    //
    this.isTrashed = false
    this.inputLength.next({ title: 0, body: 0, cb: 0 })
  }


  pasteEvent(event: ClipboardEvent) {
    event.preventDefault()
    let text = event.clipboardData?.getData('text/plain');
    let target = event.target as HTMLDivElement
    target.innerText += text
    let sel = window.getSelection()
    sel?.selectAllChildren(target)
    sel?.collapseToEnd()
  }



  innerData(note: NoteI) {
    this.notePhClick()
    this.noteTitle.nativeElement.innerHTML = note.noteTitle
    if (this.noteBody) this.noteBody.nativeElement.innerHTML = note.noteBody!
    this.notePin.nativeElement.dataset['pinned'] = String(note.pinned)
    this.noteContainer.nativeElement.style.backgroundImage = note.bgImage
    this.noteMain.nativeElement.style.backgroundColor = note.bgColor
    this.noteMain.nativeElement.style.borderColor = note.bgColor
    this.isTrashed = note.trashed
    this.inputLength.next({ title: note.noteTitle.length, body: note.noteBody ? note.noteBody?.length : 0, })
    note.labels.forEach(noteLabel => {
      let label = this.labels.find(x => x.name === noteLabel.name)
      if (label) label.added = noteLabel.added
    })
    this.cd.detectChanges()
  }

  openTooltip(button: HTMLDivElement | null, tooltipEl: HTMLDivElement) {
    if (button) {
      this.Shared.createTooltip(button, tooltipEl);
    }
  }

  moreMenu(tooltipEl: HTMLDivElement) {
    let actions = {
      trash: () => {
        if (this.isEditing) {
          this.Shared.note.operation.trash(this.Shared.note.id)
          this.Shared.closeModal.next(true)
        } else {
          this.isTrashed = true
          this.saveNote()
        }
      },
    }
    this.Shared.closeTooltip(tooltipEl)
    return actions
  }


  colorMenu = {
    bgColor: (data: bgColors) => {
      this.noteMain.nativeElement.style.backgroundColor = data
      this.noteMain.nativeElement.style.borderColor = data
    },
    bgImage: (data: bgImages) => {
      this.noteContainer.nativeElement.style.backgroundImage = `url(${data})`
    }
  }

  updateInputLength(type: InputLengthI) {
    if (type.title != undefined) this.inputLength.next({ ...this.inputLength.value, title: type.title })
    if (type.body != undefined) this.inputLength.next({ ...this.inputLength.value, body: type.body })
  }

  saveNoteSubscription?: Subscription
  ngAfterViewInit() {
    if (this.isEditing) { this.saveNoteSubscription = this.Shared.saveNote.subscribe((x: any) => { if (x) this.saveNote() }) }
    this.inputLength.subscribe((x: any) => {
      if ((x.title) || (x.body) || (x.cb)) {
        this.moreMenuEls.delete.disabled = false
      } else {
        this.moreMenuEls.delete.disabled = true
      }
    })
    if (this.isEditing) {
      this.innerData(this.noteToEdit)
    }
  }
  ngOnInit(): void {
    this.Labels.labelsList$.subscribe((labels: LabelI[]) => {
      this.Shared.label.list = labels.reverse();
      this.labels = this.Shared.label.list;
    });
  }

  ngOnDestroy() { this.saveNoteSubscription?.unsubscribe() }
}
