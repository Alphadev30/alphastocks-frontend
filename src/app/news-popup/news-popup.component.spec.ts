import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsPopupComponent } from './news-popup.component';

describe('NewsPopupComponent', () => {
  let component: NewsPopupComponent;
  let fixture: ComponentFixture<NewsPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsPopupComponent]
    });
    fixture = TestBed.createComponent(NewsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
