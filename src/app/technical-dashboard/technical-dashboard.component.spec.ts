import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalDashboardComponent } from './technical-dashboard.component';

describe('TechnicalDashboardComponent', () => {
  let component: TechnicalDashboardComponent;
  let fixture: ComponentFixture<TechnicalDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalDashboardComponent]
    });
    fixture = TestBed.createComponent(TechnicalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
