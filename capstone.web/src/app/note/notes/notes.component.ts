import { Component, OnInit, ElementRef, ViewChild, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Router, ActivationEnd, NavigationEnd, RouterEvent } from '@angular/router';
import { LabelI } from '../../interfaces/labels';
import { bgColors, bgImages } from '../../interfaces/tooltip';
import { NoteI } from '../../interfaces/notes';
import Bricks from 'bricks.js';
import { NotesService } from '../../services/notes.service';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @ViewChild("mainContainer") mainContainer!: ElementRef<HTMLInputElement>;
  @ViewChild("modalContainer") modalContainer!: ElementRef<HTMLInputElement>;
  @ViewChild("modal") modal!: ElementRef<HTMLInputElement>;
  @ViewChildren('noteEl') noteEl!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('title') title!: QueryList<ElementRef<HTMLDivElement>>;

  currentPage = {
    archive: false,
    trash: false,
    label: undefined as string | undefined
  };
  currentPageName = '';
  labels: LabelI[] = [];
  bgColors = Object.entries(bgColors);
  bgImages = Object.entries(bgImages);
  noteWidth = 240;
  clickedNoteData: NoteI = {} as NoteI;

  constructor(public Shared: SharedService, public Notes: NotesService, private cdr: ChangeDetectorRef, private router: Router, private pageService: PageService) { }

  trackBy(item: any) { return item.id; }

  buildMasonry() {
    let gutter = 10
    let totalNoteWidth = this.noteWidth + gutter
    let containerWidth = this.mainContainer.nativeElement.clientWidth
    let numberOfColumns = 0
    let masonryWidth = '0px'
    // --
    if (this.Shared.noteViewType.value === 'grid') {
      this.noteWidth = 240
      numberOfColumns = Math.floor(containerWidth / totalNoteWidth)
    }
    else {
      if (this.mainContainer.nativeElement.clientWidth >= 600) this.noteWidth = 600
      else this.noteWidth = this.mainContainer.nativeElement.clientWidth - 10
      numberOfColumns = 1
    }
    document.documentElement.style.setProperty('--note-width', this.noteWidth + "px")
    // --
    const sizes = [{ columns: numberOfColumns, gutter: gutter }]
    this.noteEl.toArray().forEach(el => { brikcs(el.nativeElement); if (el.nativeElement.style.width) masonryWidth = el.nativeElement.style.width })
    function brikcs(node: HTMLDivElement) { const instance = Bricks({ container: node, packed: 'data-packed', sizes: sizes, position: false }); instance.pack() }
    window.onresize = () => { if (this.Shared.noteViewType.value === 'list') this.Shared.noteViewType.next('grid') }
    //? we align the titles to the masonry width
    this.title.forEach(el => {
      if (this.Shared.noteViewType.value === 'list') el.nativeElement.style.maxWidth = masonryWidth
      else el.nativeElement.style.maxWidth = ''
    })
  }



  openModal(clickedNote: HTMLDivElement, noteData: NoteI) {
    this.Shared.note.id = noteData.id!
    this.clickedNoteData = noteData
    this.clickedNoteEl = clickedNote
    let modalContainer = this.modalContainer.nativeElement
    let modal = this.modal.nativeElement
    this.setModalStyling()
    setTimeout(() => { modal.removeAttribute("style") })
    clickedNote.classList.add('hide')
    modalContainer.style.display = 'block';
    document.addEventListener('mousedown', this.mouseDownEvent)
  }


  mouseDownEvent = (event: Event) => {
    let isTooltipOpen = document.querySelector('[data-is-tooltip-open="true"]')
    let modalEL = this.modal.nativeElement
    if (!(modalEL as any).contains(event.target)) {
      if (!isTooltipOpen) {
        this.Shared.saveNote.next(true)
        this.closeModal()
      }
    }
  }
  clickedNoteEl!: HTMLDivElement

  closeModal() {
    document.removeEventListener('mousedown', this.mouseDownEvent)
    let modalContainer = this.modalContainer.nativeElement
    this.setModalStyling()
    setTimeout(() => {
      this.clickedNoteEl.classList.remove('hide')
      modalContainer.style.display = 'none'
    }, 300)
  }
  setModalStyling() {
    let bounding = this.clickedNoteEl.getBoundingClientRect()
    let modal = this.modal.nativeElement
    modal.style.transform = `translate(${bounding.x}px, ${bounding.y}px)`
    modal.style.width = bounding.width + 'px'
    modal.style.height = bounding.height + 'px'
    modal.style.top = `0`
    modal.style.left = `0`
  }


  togglePin(noteId: number, pinned: boolean) {
    this.Shared.note.operation.update({ pinned: !pinned }, noteId);
  }

  removeLabel(note: NoteI, label: LabelI) {
    this.Shared.note.operation.update({ labels: note.labels.filter(l => l.id !== label.id) }, note.id!);
  }

  openTooltip(button: HTMLDivElement, tooltipEl: HTMLDivElement, noteId: number) {
    this.Shared.note.id = noteId;
    this.Shared.createTooltip(button, tooltipEl);
  }

  moreMenu(tooltipEl: HTMLDivElement) {
    const actions = {
      trash: () => {
        this.Shared.note.operation.update({ trashed: true }, this.Shared.note.id);
      },
      openLabelMenu: (tooltipEl: HTMLDivElement) => {
        this.labels = JSON.parse(JSON.stringify(this.Shared.label.list));
        this.Shared.createTooltip(this.noteEl.first.nativeElement, tooltipEl);
        const note = this.Shared.note.all.find(note => note.id === this.Shared.note.id);
        if (note) {
          note.labels.forEach(noteLabel => {
            let label = this.labels.find(x => x.name === noteLabel.name)
            if (label) label.added = noteLabel.added
          })
        }
      }
    };
    this.Shared.closeTooltip(tooltipEl);
    return actions;
  }

  colorMenu = {
    bgColor: (data: string) => {
      this.Shared.note.operation.update({ bgColor: data }, this.Shared.note.id);
    },
    bgImage: (data: string) => {
      this.Shared.note.operation.update({ bgImage: `url(${data})` }, this.Shared.note.id);
    }
  }

  labelMenu(label: LabelI) {
    label.added = !label.added;
    this.Shared.note.operation.update({ labels: this.labels }, this.Shared.note.id);
  }

  removeNote(noteId: number) {
    this.Shared.note.operation.update({ trashed: true }, noteId);
  }

  restoreNote(noteId: number) {
    this.Shared.note.operation.update({ trashed: false }, noteId);
    this.Shared.snackBar({ action: 'restored', opposite: 'trashed' }, { trashed: true }, noteId);
  }

  ngAfterViewChecked() {
    this.buildMasonry();
  }

  ngOnInit(): void {

    this.Shared.closeSideBar.subscribe(() => { setTimeout(() => { this.buildMasonry() }, 200); });
    this.Shared.closeModal.subscribe((x: any) => { if (x) this.closeModal(); });
    this.Shared.noteViewType.subscribe(() => { setTimeout(() => this.buildMasonry(), 300); });

    // this.router.events.subscribe((event: any) => {
    //   debugger
    //   console.log(event)
    //   if (event instanceof NavigationEnd) {
    //     event.url.includes('trash') ? this.currentPage.trash = true : this.currentPage.trash = false
    //   }
    //   else if (event instanceof ActivationEnd) {
    //     this.currentPage.label = event.snapshot.params['name']
    //   }
    //   this.currentPageName = this.currentPage.label ? this.currentPage.label :  (this.currentPage.trash ? 'trashed' : 'home')
    // })

    this.pageService.currentPage$.subscribe((page: any) => {
      this.currentPage = page;
      this.currentPageName = this.currentPage.label ? this.currentPage.label : (this.currentPage.trash ? 'trashed' : 'home');
    });

    this.Notes.notesList$.subscribe((notes: NoteI[]) => {
      this.Shared.note.all = notes.reverse();
      this.Shared.note.pinned = notes.filter(note => note.pinned).reverse();
      this.Shared.note.unpinned = notes.filter(note => !note.pinned).reverse();
      this.cdr.detectChanges();
      setTimeout(() => this.buildMasonry(), 0);
    });
  }
}