import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechMapsComponent } from './mech-maps.component';

describe('MechMapsComponent', () => {
  let component: MechMapsComponent;
  let fixture: ComponentFixture<MechMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
