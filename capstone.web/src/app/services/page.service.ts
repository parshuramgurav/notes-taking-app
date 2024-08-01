import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd, ActivationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private currentPageSubject = new BehaviorSubject<{ trash: boolean; label: string }>({ trash: false, label: '' });
  currentPage$ = this.currentPageSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event:any) => {
      if (event instanceof NavigationEnd) {
        const isTrash = event.url.includes('trash');
        this.updateCurrentPage({ trash: isTrash, label: this.currentPageSubject.value.label });
      } else if (event instanceof ActivationEnd) {
        const label = event.snapshot.params['name'] || '';
        this.updateCurrentPage({ trash: this.currentPageSubject.value.trash, label });
      }
    });
  }

  private updateCurrentPage(page: { trash: boolean; label: string }) {
    this.currentPageSubject.next(page);
  }
}
