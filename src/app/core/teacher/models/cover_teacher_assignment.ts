interface AssignCoverTeacherRequest {
  date: string;
  school_id: number;
  class_id: number;
  official_teacher_id: number;
  cover_teacher_id: number;
  unit_id: number;
  lesson_id: number;
  note?: string | null;
}

interface TeacherListResponse2 {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface LessonListResponse {
  lesson_id: number;
  lesson_name: string;
}

interface CoverTeacherListResponse {
  date: string;
  school_name: string;
  class_name: string;
  class_description: string;
  official_teacher_name: string;
  cover_teacher_name: string;
  level_unit: string;
  lesson_id: number;
  note: string;
}
