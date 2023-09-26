import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechMaMacdCrossComponent } from './tech-ma-macd-cross.component';

describe('TechMaMacdCrossComponent', () => {
  let component: TechMaMacdCrossComponent;
  let fixture: ComponentFixture<TechMaMacdCrossComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechMaMacdCrossComponent]
    });
    fixture = TestBed.createComponent(TechMaMacdCrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
