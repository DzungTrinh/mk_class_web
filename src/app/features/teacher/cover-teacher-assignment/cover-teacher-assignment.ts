import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cover-teacher-assignment',
  standalone: true,
  templateUrl: './cover-teacher-assignment.html',
  styleUrls: ['./cover-teacher-assignment.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CoverTeacherAssignment {
  showForm = false;
  coverForm: FormGroup;

  private apiUrl = environment.apiBase;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.coverForm = this.fb.group({
      records: this.fb.array([])
    });
    this.addRecord();
  }

  get records(): FormArray {
    return this.coverForm.get('records') as FormArray;
  }

  addRecord(): void {
    const record = this.fb.group({
      date: [''],
      school_id: [null],
      class_id: [null],
      official_teacher_id: [null],
      cover_teacher_id: [null],
      level_id: [null],
      unit_id: [null],
      lesson_id: [null],
      note: ['']
    });
    this.records.push(record);
  }

  removeRecord(index: number): void {
    this.records.removeAt(index);
  }

  saveForm(): void {
    if (this.coverForm.valid) {
      const requestData = this.coverForm.value.records.map((record: AssignCoverTeacherRequest) => ({
        date: record.date,
        school_id: record.school_id,
        class_id: record.class_id,
        official_teacher_id: record.official_teacher_id,
        cover_teacher_id: record.cover_teacher_id,
        level_id: record.level_id,
        unit_id: record.unit_id,
        lesson_id: record.lesson_id,
        note: record.note || null
      }));
      this.http.post(`${this.apiUrl}/assign-cover-teacher`, requestData, { headers: { 'Content-Type': 'application/json' } }).subscribe({
        next: () => {
          this.showForm = false;
          this.coverForm.reset();
          this.addRecord();
        },
        error: (err) => console.error('Error saving cover assignments:', err)
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.coverForm.reset();
    this.addRecord();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm && this.records.length === 0) {
      this.addRecord();
    }
  }
}