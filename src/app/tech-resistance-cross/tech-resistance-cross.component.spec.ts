import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechResistanceCrossComponent } from './tech-resistance-cross.component';

describe('TechResistanceCrossComponent', () => {
  let component: TechResistanceCrossComponent;
  let fixture: ComponentFixture<TechResistanceCrossComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechResistanceCrossComponent]
    });
    fixture = TestBed.createComponent(TechResistanceCrossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
