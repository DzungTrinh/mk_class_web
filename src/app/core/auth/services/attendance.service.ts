import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AttendanceFilter, AttendanceRecord } from '../models/attendance';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  getAttendanceHistory(filter: AttendanceFilter): Observable<AttendanceRecord[]> {
    let httpParams = new HttpParams()
      .set('start_date', filter.start_date)
      .set('end_date', filter.end_date);

    if (filter.school_id) httpParams = httpParams.set('school_id', filter.school_id);
    if (filter.class_id) httpParams = httpParams.set('class_id', filter.class_id);
    if (filter.teacher_ids && filter.teacher_ids.length > 0) httpParams = httpParams.set('teacher_ids', filter.teacher_ids.join(','));
    if (filter.is_cover !== undefined) httpParams = httpParams.set('is_cover', filter.is_cover.toString());
    if (filter.query) httpParams = httpParams.set('query', filter.query);

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

  exportAttendanceHistory(filter: AttendanceFilter): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export-teachers-attendances`, filter, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Export Error:', error);
        return throwError(() => new Error('Failed to export attendance data'));
      })
    );
  }

  getFilterValues(): Observable<{ schools: { id: number; name: string }[]; classes: { id: number; name: string }[]; teachers: { id: number; name: string }[] }> {
    return this.http.get<{ code: number; message: string; status: string; data: { schools: { id: number; name: string }[]; classes: { id: number; name: string }[]; teachers: { id: number; name: string }[] } }>(`${this.apiUrl}/filter-values`).pipe(
      map(response => {
        if (response.status === 'success') {
          return response.data;
        }
        throw new Error(response.message);
      }),
      catchError(error => {
        console.error('Filter Values Error:', error);
        return throwError(() => new Error('Failed to fetch filter values'));
      })
    );
  }
}