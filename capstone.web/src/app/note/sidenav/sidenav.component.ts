import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { LabelActionsT, LabelI } from '../../interfaces/labels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  @ViewChild("modalContainer") modalContainer !: ElementRef<HTMLInputElement>
  @ViewChild("modal") modal !: ElementRef<HTMLInputElement>
  @ViewChild("labelInput") labelInput !: ElementRef<HTMLInputElement>
  @ViewChild("labelError") labelError !: ElementRef<HTMLInputElement>

  constructor(public Shared: SharedService, public router: Router) { }

  openModal() {
    this.modalContainer.nativeElement.style.display = 'block';
    document.addEventListener('mousedown', this.mouseDownEvent)
  }

  hideModal() {
    this.modalContainer.nativeElement.style.display = 'none'
    document.removeEventListener('mousedown', this.mouseDownEvent)
  }

  mouseDownEvent = (event: Event) => {
    let modalEl = this.modal.nativeElement
    if (!(modalEl as any).contains(event.target)) {
      this.hideModal()
    }
  }

  addLabel(el: HTMLInputElement) {
    debugger
    if (!el) return
    this.Shared.label.operation.add({ name: el.value, trashed: false })
      .then(() => { this.labelError.nativeElement.hidden = true; el.value = ''; el.focus() })
      .catch(x => { if (x.name === "ConstraintError") this.labelError.nativeElement.hidden = false; el.focus() })
  }

  editLabel(label: LabelI) {
    this.Shared.label.id = label.id!;
    let actions: LabelActionsT = {
      delete: () => {
        this.Shared.label.operation.delete(label.id!);
        this.Shared.label.operation.updateAllLabels(label.id!, '');
      },
      update: (value: string) => {
        this.Shared.label.operation.update({ name: value }, label.id!);
        this.Shared.label.operation.updateAllLabels(label.id!, value);
      },
    };
    return actions;
  }

  collapseSideBar() {
    document.querySelector('[sideBar]')?.classList.toggle('close')
  }

  ngOnInit(): void {
    this.Shared.closeSideBar.subscribe((x: any) => { if (x) this.collapseSideBar() })
    if (window.innerWidth <= 600) {
      this.collapseSideBar()
    }
  }
}