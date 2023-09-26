import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class PopupService {
    private isOpenSubject = new BehaviorSubject<boolean>(false);
    isOpen$ = this.isOpenSubject.asObservable();
  
    private selectedNewsItemSubject = new BehaviorSubject<any>(null);
    selectedNewsItem$ = this.selectedNewsItemSubject.asObservable();
  
    constructor() {}
  
    openPopup(newsItem: any) {
      //this.selectedNewsItemSubject.next(newsItem);
      //this.isOpenSubject.next(true);
    }
  
    closePopup() {
      //this.isOpenSubject.next(false);
    }
  }