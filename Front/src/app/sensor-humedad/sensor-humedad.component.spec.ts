import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorHumedadComponent } from './sensor-humedad.component';

describe('SensorHumedadComponent', () => {
  let component: SensorHumedadComponent;
  let fixture: ComponentFixture<SensorHumedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorHumedadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorHumedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
