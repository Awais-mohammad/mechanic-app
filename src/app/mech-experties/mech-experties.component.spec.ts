import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechExpertiesComponent } from './mech-experties.component';

describe('MechExpertiesComponent', () => {
  let component: MechExpertiesComponent;
  let fixture: ComponentFixture<MechExpertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechExpertiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechExpertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
