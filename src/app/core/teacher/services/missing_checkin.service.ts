import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MissingCheckinService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSchools(): Observable<SchoolListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<SchoolListResponse[]>>(`${this.apiUrl}/school-list`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load schools');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(`API Error: ${error.message}`)))
      );
  }

  getClasses(schoolId: number): Observable<ClassListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<ClassListResponse[]>>(`${this.apiUrl}/class-list-by-school?school_id=${schoolId}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load classes');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(`API Error: ${error.message}`)))
      );
  }

  getUnits(classId: number): Observable<UnitListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<UnitListResponse[]>>(`${this.apiUrl}/unit-list-by-class?class_id=${classId}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load units');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(`API Error: ${error.message}`)))
      );
  }

  getTeachers(classId: number): Observable<TeacherListResponse[]> {
    return this.http
      .get<ControllerResponseDTO<TeacherListResponse[]>>(`${this.apiUrl}/teacher-list-by-class?class_id=${classId}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to load teachers');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(`API Error: ${error.message}`)))
      );
  }

  getMissingCheckIns(request: {
    school_id: number;
    class_id: number;
    unit_id: number;
    model_id: number;
    level_id: number;
    teacher_id?: number;
  }): Observable<MissingCheckInResponse> {
    let params = new HttpParams()
      .set('school_id', request.school_id.toString())
      .set('class_id', request.class_id.toString())
      .set('unit_id', request.unit_id.toString())
      .set('model_id', request.model_id.toString())
      .set('level_id', request.level_id.toString());

    if (request.teacher_id !== undefined) {
      params = params.set('teacher_id', request.teacher_id.toString());
    }

    return this.http
      .get<MissingCheckInResponse>(`${this.apiUrl}/get_missing_checkin`, {
        params,
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error) => throwError(() => new Error(`API Error: ${error.message}`)))
      );
  }

  saveCheckIn(request: {
    class_id: number;
    teacher_id: number;
    game_category_id: number;
    lesson_id: number;
    level_order: number;
    category_order: number;
    lesson_order: number;
    date: number;
  }): Observable<any> {
    return this.http
      .post<ControllerResponseDTO<any>>(`${this.apiUrl}/update_or_create_completed_lesson`, request, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response: ControllerResponseDTO<any>) => {
          if (response.code !== 200 || response.status !== 'success') {
            throw new Error(response.message || 'Failed to save check-in');
          }
          return response.data;
        }),
        catchError((error) => throwError(() => new Error(`API Error: ${error.message}`)))
      );
  }
}
