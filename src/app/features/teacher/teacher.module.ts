import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, TeacherRoutingModule, FormsModule],
  providers: [DatePipe],
})
export class TeacherModule {}
