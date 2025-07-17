import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CoverTeacherService } from '../../../core/teacher/services/cover_teacher.service';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-cover-teacher-assignment',
  standalone: true,
  templateUrl: './cover-teacher-assignment.html',
  styleUrls: ['./cover-teacher-assignment.css'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CoverTeacherService],
})
export class CoverTeacherAssignment implements OnInit {
  showForm = false;
  coverForm: FormGroup;
  schools: Option[] = [];
  classes: Option[] = [];
  officialTeachers: Option[] = [];
  coverTeachers: Option[] = [];
  units: Option[] = [];
  lessons: Option[] = [];
  loading = {
    schools: false,
    classes: false,
    teachers: false,
    units: false,
    lessons: false,
  };
  private subscriptions: Subscription[] = [];
  assignments: CoverTeacherListResponse[] = [];
  loadingAssignments = false;

  constructor(
    private fb: FormBuilder,
    private coverService: CoverTeacherService
  ) {
    this.coverForm = this.fb.group({
      records: this.fb.array([]),
    });
  }

  get records(): FormArray {
    return this.coverForm.get('records') as FormArray;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm && this.records.length === 0) {
      this.loadSchools();
      this.loadCoverTeachers();
      this.addRecord();
    }
  }

  loadSchools() {
    this.loading.schools = true;
    this.coverService.getSchools().subscribe({
      next: (data) => {
        const safeData = Array.isArray(data) ? data : [];
        this.schools = safeData.map((s) => ({
          id: s.school_id,
          name: s.school_name,
        }));
        this.loading.schools = false;
      },
      error: (err) => {
        console.error(err.message);
        this.loading.schools = false;
      },
    });
  }

  loadClasses(schoolId: number) {
    if (this.loading.classes) return;
    this.loading.classes = true;
    this.classes = [];
    this.officialTeachers = [];
    this.units = [];
    this.lessons = [];
    this.coverService.getClasses(schoolId).subscribe({
      next: (data) => {
        const safeData = Array.isArray(data) ? data : [];
        this.classes = safeData.map((c) => ({
          id: c.class_id,
          name: c.class_code,
        }));
        this.loading.classes = false;
      },
      error: (err) => {
        console.error(err.message);
        this.loading.classes = false;
      },
    });
  }

  loadOfficialTeachers(classId: number) {
    if (this.loading.teachers) return;
    this.loading.teachers = true;
    this.officialTeachers = [];
    this.units = [];
    this.lessons = [];
    this.coverService.getTeachers(classId).subscribe({
      next: (data) => {
        const safeData = Array.isArray(data) ? data : [];
        this.officialTeachers = safeData.map((t) => ({
          id: t.teacher_id,
          name: t.teacher_name,
        }));
        this.loading.teachers = false;
      },
      error: (err) => {
        console.error(err.message);
        this.loading.teachers = false;
      },
    });
  }

  loadCoverTeachers() {
    if (this.loading.teachers) return;
    this.loading.teachers = true;
    this.coverService.getAllTeachers().subscribe({
      next: (data) => {
        const safeData = data?.length > 0 ? data : [];
        this.coverTeachers = safeData.map((t) => ({
          id: t.id,
          name: t.name,
        }));
        this.loading.teachers = false;
      },
      error: (err) => {
        console.error(err.message);
        this.loading.teachers = false;
      },
    });
  }

  loadUnits(classId: number) {
    if (this.loading.units) return;
    this.loading.units = true;
    this.units = [];
    this.lessons = [];
    this.coverService.getUnits(classId).subscribe({
      next: (data) => {
        const safeData = Array.isArray(data) ? data : [];
        this.units = safeData.map((u) => ({
          id: u.unit_id,
          name: u.unit_name,
        }));
        this.loading.units = false;
      },
      error: (err) => {
        console.error(err.message);
        this.loading.units = false;
      },
    });
  }

  loadLessons(classId: number, unitId: number) {
    if (this.loading.lessons) return;
    this.loading.lessons = true;
    this.lessons = [];
    this.coverService.getLessons(classId, unitId).subscribe({
      next: (data) => {
        const safeData = Array.isArray(data) ? data : [];
        this.lessons = safeData.map((l) => ({
          id: l.lesson_id,
          name: l.lesson_name,
        }));
        this.loading.lessons = false;
      },
      error: (err) => {
        console.error('Lesson fetch failed:', err.message);
        this.loading.lessons = false;
      },
    });
  }

  addRecord(): void {
    if (this.records.length === 0) {
      const record = this.fb.group({
        date: [''],
        school_id: [null],
        class_id: [null],
        official_teacher_id: [null],
        cover_teacher_id: [null],
        unit_id: [null],
        lesson_id: [null],
        note: [''],
      });
      this.setupValueChanges(record);
      this.records.push(record);
    }
  }

  addNewRecord(): void {
    const record = this.fb.group({
      date: [''],
      school_id: [null],
      class_id: [null],
      official_teacher_id: [null],
      cover_teacher_id: [null],
      unit_id: [null],
      lesson_id: [null],
      note: [''],
    });
    this.setupValueChanges(record);
    this.records.push(record);
  }

  removeRecord(index: number): void {
    this.records.removeAt(index);
    if (this.records.length === 0) {
      this.showForm = false;
    }
  }

  saveForm(): void {
    if (this.coverForm.valid) {
      const records = this.coverForm.value.records;
      const requestData = records.length > 1 ? records : records[0];
      this.coverService.saveAssignments(requestData).subscribe({
        next: () => {
          this.showForm = false;
          this.coverForm.reset();
          this.loadAssignments();
        },
        error: (err) => console.error(err.message),
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.coverForm.reset();
  }

  setupValueChanges(record: FormGroup) {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    const schoolId$ = new Subject<number>();
    const classId$ = new Subject<number>();
    const unitId$ = new Subject<number>();

    const schoolSub = schoolId$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((schoolId) => {
        if (schoolId) this.loadClasses(schoolId);
      });
    this.subscriptions.push(schoolSub);

    const classSub = classId$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((classId) => {
        if (classId) {
          this.loadOfficialTeachers(classId);
          this.loadUnits(classId);
        }
      });
    this.subscriptions.push(classSub);

    const unitSub = unitId$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((unitId) => {
        const classId = record.get('class_id')?.value;
        if (unitId) this.loadLessons(classId, unitId);
      });
    this.subscriptions.push(unitSub);

    const schoolControl = record.get('school_id');
    if (schoolControl) {
      const schoolSubValue = schoolControl.valueChanges.subscribe(
        (schoolId) => {
          record.patchValue({
            class_id: null,
            official_teacher_id: null,
            unit_id: null,
            lesson_id: null,
          });
          this.classes = [];
          this.officialTeachers = [];
          this.units = [];
          this.lessons = [];
          schoolId$.next(schoolId || 0);
        }
      );
      this.subscriptions.push(schoolSubValue);
    }

    const classControl = record.get('class_id');
    if (classControl) {
      const classSubValue = classControl.valueChanges.subscribe((classId) => {
        record.patchValue({
          official_teacher_id: null,
          unit_id: null,
          lesson_id: null,
        });
        this.officialTeachers = [];
        this.units = [];
        this.lessons = [];
        classId$.next(classId || 0);
      });
      this.subscriptions.push(classSubValue);
    }

    const unitControl = record.get('unit_id');
    if (unitControl) {
      const unitSubValue = unitControl.valueChanges.subscribe((unitId) => {
        record.patchValue({
          lesson_id: null,
        });
        this.lessons = [];
        unitId$.next(unitId || 0);
      });
      this.subscriptions.push(unitSubValue);
    }
  }

  isFormValid(): boolean {
    return this.records.controls.every((record) => {
      const r = record as FormGroup;
      return (
        r.get('date')?.value &&
        r.get('school_id')?.value &&
        r.get('class_id')?.value &&
        r.get('official_teacher_id')?.value &&
        r.get('cover_teacher_id')?.value &&
        r.get('unit_id')?.value &&
        r.get('lesson_id')?.value
      );
    });
  }

  loadAssignments() {
    this.loadingAssignments = true;
    this.coverService.getCoverTeacherList().subscribe({
      next: (data) => {
        this.assignments = Array.isArray(data) ? data : [];
        this.loadingAssignments = false;
      },
      error: (err) => {
        console.error(err.message);
        this.loadingAssignments = false;
      },
    });
  }

  ngOnInit() {
    this.loadAssignments();
  }
}
