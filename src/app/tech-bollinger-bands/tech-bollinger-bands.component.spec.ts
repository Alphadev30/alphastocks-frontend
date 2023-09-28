import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechBollingerBandsComponent } from './tech-bollinger-bands.component';

describe('TechBollingerBandsComponent', () => {
  let component: TechBollingerBandsComponent;
  let fixture: ComponentFixture<TechBollingerBandsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechBollingerBandsComponent]
    });
    fixture = TestBed.createComponent(TechBollingerBandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
