import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechServicesComponent } from './mech-services.component';

describe('MechServicesComponent', () => {
  let component: MechServicesComponent;
  let fixture: ComponentFixture<MechServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
