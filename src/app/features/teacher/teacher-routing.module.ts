import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Attendance } from './attendance/attendance';
import { CoverTeacherAssignment } from './cover-teacher-assignment/cover-teacher-assignment';


const routes: Routes = [
  { path: 'attendance', component: Attendance},
  { path: 'cover-teacher-assignment', component: CoverTeacherAssignment }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}