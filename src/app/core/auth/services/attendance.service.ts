import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AttendanceRecord } from '../models/attendance';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  getAttendanceHistory(params: { start_date: string; end_date: string; school_id?: string; class_id?: string; teacher_id?: string; is_cover?: string; query?: string }): Observable<AttendanceRecord[]> {
    let httpParams = new HttpParams()
      .set('start_date', params.start_date)
      .set('end_date', params.end_date);

    if (params.school_id) httpParams = httpParams.set('school_id', params.school_id);
    if (params.class_id) httpParams = httpParams.set('class_id', params.class_id);
    if (params.teacher_id) httpParams = httpParams.set('teacher_id', params.teacher_id);
    if (params.is_cover) httpParams = httpParams.set('is_cover', params.is_cover);
    if (params.query) httpParams = httpParams.set('query', params.query);

    return this.http.get<{ code: number; message: string; status: string; data: { [key: string]: AttendanceRecord[] } }>(`${this.apiUrl}/all-teachers-attendances`, { params: httpParams }).pipe(
      map(response => {
        if (response.status === 'success') {
          return Object.values(response.data).flat();
        }
        throw new Error(response.message);
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to fetch attendance data'));
      })
    );
  }

  exportAttendanceHistory(params: { start_date: string; end_date: string; school_id?: string; class_id?: string; teacher_id?: string; is_cover?: string; query?: string }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export-teachers-attendances`, params, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Export Error:', error);
        return throwError(() => new Error('Failed to export attendance data'));
      })
    );
  }
}