import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MissingCheckinService } from '../../../core/teacher/services/missing_checkin.service';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-missing-checkin',
  standalone: true,
  templateUrl: './missing-checkin.html',
  styleUrls: ['./missing-checkin.css'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [MissingCheckinService],
})
export class MissingCheckinComponent implements OnInit {
  missingCheckIns: {
    lesson: MissingCheckInResponse['data'][0]['lessons'][0];
    showForm: boolean;
  }[] = [];
  checkInForm: FormGroup;
  filterForm: FormGroup;
  loading = {
    schools: false,
    classes: false,
    units: false,
    teachers: false,
    checkIns: false,
  };
  selectedLesson: MissingCheckInResponse['data'][0]['lessons'][0] | null = null;
  isModalOpen = false;
  schools: Option[] = [];
  classes: Option[] = [];
  units: Option[] = [];
  teachers: Option[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private missingCheckinService: MissingCheckinService,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      school_id: ['', Validators.required],
      class_id: ['', Validators.required],
      unit: [null, Validators.required],
      teacher_id: [''],
    });
    this.checkInForm = this.fb.group({
      school_name: [{ value: '', disabled: true }],
      class_code: [{ value: '', disabled: true }],
      lesson_name: [{ value: '', disabled: true }],
      teacher_name: [{ value: '', disabled: true }],
      date: ['', Validators.required],
    });

    this.setupValueChanges();
  }

  ngOnInit() {
    this.loadSchools();
  }

  setupValueChanges() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];

    const schoolId$ = new Subject<number>();
    const classId$ = new Subject<number>();

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
          this.loadUnits(classId);
          this.loadTeachers(classId);
        }
      });
    this.subscriptions.push(classSub);

    const schoolControl = this.filterForm.get('school_id');
    if (schoolControl) {
      const schoolSubValue = schoolControl.valueChanges.subscribe(
        (schoolId) => {
          this.filterForm.patchValue({
            class_id: '',
            unit_id: '',
            teacher_id: '',
          });
          this.classes = [];
          this.units = [];
          this.teachers = [];
          this.missingCheckIns = [];
          schoolId$.next(schoolId || 0);
        }
      );
      this.subscriptions.push(schoolSubValue);
    }

    const classControl = this.filterForm.get('class_id');
    if (classControl) {
      const classSubValue = classControl.valueChanges.subscribe((classId) => {
        this.filterForm.patchValue({
          unit_id: '',
          teacher_id: '',
        });
        this.units = [];
        this.teachers = [];
        this.missingCheckIns = [];
        classId$.next(classId || 0);
      });
      this.subscriptions.push(classSubValue);
    }
  }
  loadSchools() {
    this.loading.schools = true;
    this.missingCheckinService.getSchools().subscribe({
      next: (schools) => {
        this.schools = schools.map((s) => ({
          id: s.school_id,
          name: s.school_name,
        }));
        this.loading.schools = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message);
        this.showToast('Failed to load schools');
        this.loading.schools = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadClasses(schoolId: number) {
    if (this.loading.classes) return;
    this.loading.classes = true;
    this.missingCheckinService.getClasses(schoolId).subscribe({
      next: (classes) => {
        this.classes = classes.map((c) => ({
          id: c.class_id,
          name: c.class_code,
        }));
        this.loading.classes = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message);
        this.showToast('Failed to load classes');
        this.loading.classes = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadUnits(classId: number) {
    if (this.loading.units) return;
    this.loading.units = true;
    this.missingCheckinService.getUnits(classId).subscribe({
      next: (units) => {
        this.units = units.map((u) => ({ id: u.unit_id, name: u.unit_name }));
        this.loading.units = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message);
        this.showToast('Failed to load units');
        this.loading.units = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadTeachers(classId: number) {
    if (this.loading.teachers) return;
    this.loading.teachers = true;
    this.missingCheckinService.getTeachers(classId).subscribe({
      next: (teachers) => {
        this.teachers = teachers.map((t) => ({
          id: t.teacher_id,
          name: t.teacher_name,
        }));
        this.loading.teachers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message);
        this.showToast('Failed to load teachers');
        this.loading.teachers = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadMissingCheckIns() {
    if (this.filterForm.valid) {
      this.loading.checkIns = true;
      const selectedUnit = this.filterForm.value.unit;
      if (!selectedUnit) return;

      const modelId = selectedUnit.model_id;
      const levelId = selectedUnit.level_id;
      const unitId = selectedUnit.unit_id;
      const request = {
        school_id: this.filterForm.value.school_id,
        class_id: this.filterForm.value.class_id,
        unit_id: unitId,
        model_id: modelId,
        level_id: levelId,
        teacher_id: this.filterForm.value.teacher_id,
      };
      this.missingCheckinService.getMissingCheckIns(request).subscribe({
        next: (response) => {
          if (response.code === 200 && response.status === 'success') {
            this.missingCheckIns = response.data.flatMap((d) =>
              d.lessons.map((lesson) => ({ lesson, showForm: false }))
            );
          }
          this.loading.checkIns = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err.message);
          this.showToast('Failed to load missing check-ins');
          this.loading.checkIns = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  openCheckInForm(lesson: MissingCheckInResponse['data'][0]['lessons'][0]) {
    this.selectedLesson = lesson;
    this.checkInForm.patchValue({
      school_name: lesson.school_name,
      class_code: lesson.class_code,
      lesson_name: lesson.lesson_name,
      teacher_name: lesson.teacher_name,
      date: '',
    });
    this.isModalOpen = true;
  }

  saveCheckIn() {
    if (this.checkInForm.valid && this.selectedLesson) {
      const dateValue = new Date(this.checkInForm.value.date).getTime() / 1000;
      const request = {
        class_id: this.selectedLesson.class_id,
        teacher_id: this.selectedLesson.teacher_id,
        game_category_id: this.selectedLesson.unit_id,
        lesson_id: this.selectedLesson.lesson_id,
        level_order: this.selectedLesson.level_order,
        category_order: this.selectedLesson.unit_order,
        lesson_order: this.selectedLesson.lesson_order,
        date: dateValue,
      };
      this.missingCheckinService.saveCheckIn(request).subscribe({
        next: () => {
          this.loadMissingCheckIns();
          this.closeForm();
          this.showToast('Check-in saved successfully');
        },
        error: (err) => {
          console.error(err.message);
          this.showToast('Failed to save check-in');
        },
      });
    }
  }

  closeForm() {
    this.isModalOpen = false;
    this.selectedLesson = null;
    this.checkInForm.reset({
      school_name: '',
      class_code: '',
      lesson_name: '',
      teacher_name: '',
      date: '',
    });
  }

  private showToast(message: string) {
    console.log('Toast:', message);
  }
}
