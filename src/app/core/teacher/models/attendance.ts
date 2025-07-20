export interface AttendanceRecord {
  id: number;
  date: string;
  school_name: string;
  class_name: string;
  class_code: string;
  teacher_name: string;
  level_unit: string;
  lesson_id: number;
  lesson_name: string;
  checkin_by: string;
  is_cover: boolean;
}
export interface AttendanceFilter {
  start_date: string;
  end_date: string;
  school_id?: number;
  class_id?: number;
  teacher_ids?: number[];
  is_cover?: boolean;
  query?: string;
  page?: number;
  page_size?: number;
}