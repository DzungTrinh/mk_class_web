import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Attendance } from './attendance/attendance';


const routes: Routes = [
  { path: '', component: Attendance }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}