import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CoverTeacherService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSchools(): Observable<SchoolListResponse[]> {
    return this.http.get<ControllerResponseDTO<SchoolListResponse[]>>(`${this.apiUrl}/school-list`).pipe(
      map(response => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error(response.message || 'Failed to load schools');
        }
        return response.data;
      }),
      catchError(error => throwError(() => new Error(`API Error: ${error.message}`)))
    );
  }

  getClasses(schoolId: number): Observable<ClassListResponse[]> {
    return this.http.get<ControllerResponseDTO<ClassListResponse[]>>(`${this.apiUrl}/class-list-by-school?school_id=${schoolId}`).pipe(
      map(response => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error(response.message || 'Failed to load classes');
        }
        return response.data;
      }),
      catchError(error => throwError(() => new Error(`API Error: ${error.message}`)))
    );
  }

  getTeachers(classId: number): Observable<TeacherListResponse[]> {
    return this.http.get<ControllerResponseDTO<TeacherListResponse[]>>(`${this.apiUrl}/teacher-list-by-class?class_id=${classId}`).pipe(
      map(response => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error(response.message || 'Failed to load teachers');
        }
        return response.data;
      }),
      catchError(error => throwError(() => new Error(`API Error: ${error.message}`)))
    );
  }

  getUnits(classId: number): Observable<UnitListResponse[]> {
    return this.http.get<ControllerResponseDTO<UnitListResponse[]>>(`${this.apiUrl}/unit-list-by-class?class_id=${classId}`).pipe(
      map(response => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error(response.message || 'Failed to load units');
        }
        return response.data;
      }),
      catchError(error => throwError(() => new Error(`API Error: ${error.message}`)))
    );
  }

  getLessons(classId: number, unitId: number): Observable<LessonListResponse[]> {
    return this.http.get<ControllerResponseDTO<LessonListResponse[]>>(`${this.apiUrl}/lesson-list-by-unit?class_id=${classId}&unit_id=${unitId}`).pipe(
      map(response => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error(response.message || 'Failed to load lessons');
        }
        return response.data;
      }),
      catchError(error => throwError(() => new Error(`API Error: ${error.message}`)))
    );
  }

  saveAssignments(data: AssignCoverTeacherRequest): Observable<any> {
    return this.http.post<ControllerResponseDTO<any>>(`${this.apiUrl}/assign-cover-teacher`, data, { headers: { 'Content-Type': 'application/json' } }).pipe(
      map(response => {
        if (response.code !== 200 || response.status !== 'success') {
          throw new Error(response.message || 'Failed to save assignments');
        }
        return response.data;
      }),
      catchError(error => throwError(() => new Error(`API Error: ${error.message}`)))
    );
  }
}

interface AssignCoverTeacherRequest {
  date: string;
  school_id: number;
  class_id: number;
  official_teacher_id: number;
  cover_teacher_id: number;
  unit_id: number;
  lesson_id: number;
  note?: string | null;
}