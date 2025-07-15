export interface AttendanceRecord {
  id: number;
  date: string;
  school_name: string;
  class_name: string;
  class_code: string;
  teacher_name: string;
  level_unit: string;
  lesson_number: number;
  checkin_by: string;
  is_cover: boolean;
}