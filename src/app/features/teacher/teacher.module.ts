import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';


@NgModule({
  imports: [CommonModule, TeacherRoutingModule],
  providers: [DatePipe],
})
export class TeacherModule {}
