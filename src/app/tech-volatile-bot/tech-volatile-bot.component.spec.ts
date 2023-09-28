import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechVolatileBotComponent } from './tech-volatile-bot.component';

describe('TechVolatileBotComponent', () => {
  let component: TechVolatileBotComponent;
  let fixture: ComponentFixture<TechVolatileBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechVolatileBotComponent]
    });
    fixture = TestBed.createComponent(TechVolatileBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
