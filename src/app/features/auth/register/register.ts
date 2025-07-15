import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  form: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    },
    { validators: this.passwordsMatch }
  );

  loading = false;
  errorMsg = '';

  private passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const conf = group.get('confirm')?.value;
    return pass === conf ? null : { notMatch: true };
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.auth
      .register({
        email: this.form.value.email!,
        username: this.form.value.username!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => (this.loading = false), // navigation handled in AuthService
        error: err => {
          this.errorMsg = err?.error?.message ?? 'Registration failed';
          this.loading = false;
        },
      });
  }
}