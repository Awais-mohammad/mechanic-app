import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechDashboardComponent } from './mech-dashboard.component';

describe('MechDashboardComponent', () => {
  let component: MechDashboardComponent;
  let fixture: ComponentFixture<MechDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
