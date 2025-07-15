import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false],
  });

  loading = false;
  errorMsg = '';

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    this.auth
      .login({
        email: this.form.value.email!,
        password: this.form.value.password!,
        rememberDevice: this.form.value.remember!,
      })
      .subscribe({
        next: () => (this.loading = false),
        error: (err) => {
          this.errorMsg = err?.error?.message ?? 'Login failed';
          this.loading = false;
        },
      });
  }
}
