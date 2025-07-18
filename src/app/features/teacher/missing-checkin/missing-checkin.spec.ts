import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingCheckin } from './missing-checkin';

describe('MissingCheckin', () => {
  let component: MissingCheckin;
  let fixture: ComponentFixture<MissingCheckin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingCheckin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingCheckin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
