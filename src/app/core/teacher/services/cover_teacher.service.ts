import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CoverTeacherService {
  private apiUrl = environment.apiUrl;
  private eduUserUrl = environment.eduUserUrl;
  private tokenToServer = environment.tokenToServer;

  constructor(private http: HttpClient) {}

  getSchools(): Observable<SchoolListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<SchoolListResponse[]>>(
        `${this.apiUrl}/school-list`
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load schools');
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }

  getClasses(schoolId: number): Observable<ClassListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<ClassListResponse[]>>(
        `${this.apiUrl}/class-list-by-school?school_id=${schoolId}`
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load classes');
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }

  getTeachers(classId: number): Observable<TeacherListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<TeacherListResponse[]>>(
        `${this.apiUrl}/teacher-list-by-class?class_id=${classId}`
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load teachers');
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }

  getUnits(classId: number): Observable<UnitListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<UnitListResponse[]>>(
        `${this.apiUrl}/unit-list-by-class?class_id=${classId}`
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load units');
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }

  getLessons(
    classId: number,
    unitId: number
  ): Observable<LessonListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<LessonListResponse[]>>(
        `${this.apiUrl}/lesson-list-by-unit?class_id=${classId}&unit_id=${unitId}`
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load lessons');
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }

  saveAssignments(data: AssignCoverTeacherRequest): Observable<any> {
    return this.http
      .post<ControllerResponseDTO<any>>(
        `${this.apiUrl}/assign-cover-teacher`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to save assignments');
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }

  getCoverTeacherList(): Observable<CoverTeacherListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<CoverTeacherListResponse[]>>(
        `${this.apiUrl}/cover-teacher-list`
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(
              response.message || 'Failed to load cover teacher list'
            );
          }
          return response.data;
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }
  getAllTeachers(): Observable<TeacherListResponse2[]> {
    const headers = new HttpHeaders({
      token: this.tokenToServer,
    });
    return this.http
      .get<ControllerResponseDTO<{ [key: number]: TeacherListResponse2 }>>(
        `${this.eduUserUrl}/get-all-teachers`,
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load all teachers');
          }
          return Object.values(response.data);
        }),
        catchError((error) =>
          throwError(() => new Error(`API Error: ${error.message}`))
        )
      );
  }
}
