import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/teacher', pathMatch: 'full' },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./features/teacher/teacher.module').then((m) => m.TeacherModule),
  },
  { path: '**', redirectTo: '/teacher' },
];
