import { Component, OnInit } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { AttendanceRecord } from '../../../core/auth/models/attendance';
import { AttendanceService } from '../../../core/auth/services/attendance.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-attendance',
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
  imports: [CommonModule, FormsModule]
})
export class Attendance implements OnInit {
  attendanceRecords: AttendanceRecord[] = [];
  isLoading = false;
  error: string | null = null;

  startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];
  schoolId = '';
  classId = '';
  teacherId = '';
  isCover = '';
  query = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.isLoading = true;
    this.error = null;
    this.attendanceService.getAttendanceHistory({ start_date: this.startDate, end_date: this.endDate, school_id: this.schoolId || undefined, class_id: this.classId || undefined, teacher_id: this.teacherId || undefined, is_cover: this.isCover || undefined, query: this.query || undefined }).subscribe({
      next: (records) => {
        this.attendanceRecords = records;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load attendance data. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching attendance:', err);
      }
    });
  }

  applyFilters(): void {
    this.loadAttendance();
  }

  clearFilters(): void {
    this.startDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    this.endDate = new Date().toISOString().split('T')[0];
    this.schoolId = '';
    this.classId = '';
    this.teacherId = '';
    this.isCover = '';
    this.query = '';
    this.loadAttendance();
  }

  exportData(): void {
    this.isLoading = true;
    this.error = null;
    const exportParams = {
      start_date: this.startDate,
      end_date: this.endDate,
      school_id: this.schoolId || undefined,
      class_id: this.classId || undefined,
      teacher_id: this.teacherId || undefined,
      is_cover: this.isCover || undefined,
      query: this.query || undefined
    };
    this.attendanceService.exportAttendanceHistory(exportParams).subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_${this.startDate}_to_${this.endDate}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to export attendance data. Please try again later.';
        this.isLoading = false;
        console.error('Error exporting attendance:', err);
      }
    });
  }
}