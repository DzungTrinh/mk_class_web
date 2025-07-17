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

interface SchoolListResponse {
  school_id: number;
  school_name: string;
}

interface ClassListResponse {
  class_id: number;
  class_code: string;
}

interface TeacherListResponse {
  teacher_id: number;
  teacher_name: string;
}

interface UnitListResponse {
  unit_id: number;
  unit_name: string;
}

interface LessonListResponse {
  lesson_id: number;
  lesson_name: string;
}