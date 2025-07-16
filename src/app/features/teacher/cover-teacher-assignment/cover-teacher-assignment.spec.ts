import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTeacherAssignment } from './cover-teacher-assignment';

describe('CoverTeacherAssignment', () => {
  let component: CoverTeacherAssignment;
  let fixture: ComponentFixture<CoverTeacherAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverTeacherAssignment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverTeacherAssignment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
