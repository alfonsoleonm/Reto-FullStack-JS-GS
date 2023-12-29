import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorTempComponent } from './sensor-temp.component';

describe('SensorTempComponent', () => {
  let component: SensorTempComponent;
  let fixture: ComponentFixture<SensorTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorTempComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
