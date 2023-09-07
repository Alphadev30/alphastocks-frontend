import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalAnalysisPageComponent } from './technical-analysis-page.component';

describe('TechnicalAnalysisPageComponent', () => {
  let component: TechnicalAnalysisPageComponent;
  let fixture: ComponentFixture<TechnicalAnalysisPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalAnalysisPageComponent]
    });
    fixture = TestBed.createComponent(TechnicalAnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
