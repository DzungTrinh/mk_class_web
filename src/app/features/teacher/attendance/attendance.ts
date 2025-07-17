import { Component, OnInit } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import {
  AttendanceFilter,
  AttendanceRecord,
} from '../../../core/teacher/models/attendance';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../../core/teacher/services/attendance.service';

@Component({
  standalone: true,
  selector: 'app-attendance',
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  imports: [CommonModule, FormsModule],
})
export class Attendance implements OnInit {
  attendanceRecords: AttendanceRecord[] = [];
  isLoading = false;
  isExporting = false;
  error: string | null = null;

  startDate = new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split('T')[0];
  endDate = new Date().toISOString().split('T')[0];
  schoolId = '';
  classId = '';
  teacherId = '';
  isCover = '';
  query = '';

  schools: { id: number; name: string }[] = [];
  classes: { id: number; name: string }[] = [];
  teachers: { id: number; name: string }[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadFilterValues();
    this.loadAttendance();
  }

  loadFilterValues(): void {
    this.isLoading = true;
    this.attendanceService.getFilterValues().subscribe({
      next: (data) => {
        this.schools = data.schools;
        this.classes = data.classes;
        this.teachers = data.teachers;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load filter values. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching filter values:', err);
      },
    });
  }

  loadAttendance(): void {
    this.isLoading = true;
    this.error = null;
    const filter: AttendanceFilter = {
      start_date: this.startDate,
      end_date: this.endDate,
      school_id: this.schoolId ? Number(this.schoolId) : undefined,
      class_id: this.classId ? Number(this.classId) : undefined,
      teacher_ids: this.teacherId ? [Number(this.teacherId)] : undefined,
      is_cover:
        this.isCover === 'true'
          ? true
          : this.isCover === 'false'
          ? false
          : undefined,
      query: this.query || undefined,
    };
    this.attendanceService.getAttendanceHistory(filter).subscribe({
      next: (records) => {
        this.attendanceRecords = records;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load attendance data. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching attendance:', err);
      },
    });
  }

  applyFilters(): void {
    this.loadAttendance();
  }

  clearFilters(): void {
    this.startDate = new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split('T')[0];
    this.endDate = new Date().toISOString().split('T')[0];
    this.schoolId = '';
    this.classId = '';
    this.teacherId = '';
    this.isCover = '';
    this.query = '';
    this.loadAttendance();
  }

  exportData(): void {
    this.isExporting=true;
    this.error = null;
    const filter: AttendanceFilter = {
      start_date: this.startDate,
      end_date: this.endDate,
      school_id: this.schoolId ? Number(this.schoolId) : undefined,
      class_id: this.classId ? Number(this.classId) : undefined,
      teacher_ids: this.teacherId ? [Number(this.teacherId)] : undefined,
      is_cover:
        this.isCover === 'true'
          ? true
          : this.isCover === 'false'
          ? false
          : undefined,
      query: this.query || undefined,
    };
    this.attendanceService.exportAttendanceHistory(filter).subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
        );
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${this.startDate}_to_${this.endDate}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: (err) => {
        this.error =
          'Failed to export attendance data. Please try again later.';
        this.isExporting = false;
        console.error('Error exporting attendance:', err);
      },
    });
  }

  updateTeacherIds(value: string): void {
    this.teacherId = value;
  }
}
