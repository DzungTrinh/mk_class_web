import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { LoginDto } from '../models/login';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../utils/token-storage';
import { TokenResponse } from '../models/token';
import { RegisterDto } from '../models/register';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  accessToken = signal<string | null>(getAccessToken());
  refreshToken = signal<string | null>(getRefreshToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDto) {
    return this.http.post<TokenResponse>(`${environment.apiBase}/user/login`, dto).pipe(
      tap(res => this.finishAuth(res))
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<TokenResponse>(`${environment.apiBase}/user/register`, dto).pipe(
      tap(res => this.finishAuth(res))
    );
  }

  logout() {
    clearTokens();
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.router.navigate(['/login']);
  }

  /** called by refresh.interceptor on 401 */
  refresh() {
    const refresh_token = getRefreshToken();
    if (!refresh_token) return throwError(() => new Error('No refresh token'));
    return this.http
      .post<TokenResponse>(`${environment.apiBase}/user/refresh`, { refresh_token })
      .pipe(tap(res => this.finishAuth(res)));
  }

  private finishAuth(res: TokenResponse) {
    setTokens(res.accessToken, res.refreshToken);
    this.accessToken.set(res.accessToken);
    this.refreshToken.set(res.refreshToken);
    if (res.mfaRequired) {
      this.router.navigate(['/mfa']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
