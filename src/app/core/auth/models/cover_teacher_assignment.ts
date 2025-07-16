interface AssignCoverTeacherRequest {
  date: string;
  school_id: number;
  class_id: number;
  official_teacher_id: number;
  cover_teacher_id: number;
  level_id: number;
  unit_id: number;
  lesson_id: number;
  note?: string | null;
}