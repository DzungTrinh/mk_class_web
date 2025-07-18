interface Option {
  id: number;
  name: string;
}

interface ControllerResponseDTO<T> {
  code: number;
  message: string;
  status: string;
  data: T;
}

interface SchoolListResponse {
  school_id: number;
  school_name: string;
}

interface ClassListResponse {
  class_id: number;
  class_name: string;
  class_code: string;
}

interface TeacherListResponse {
  teacher_id: number;
  teacher_name: string;
}

interface UnitListResponse {
  unit_id: number;
  unit_name: string;
  model_id: number;
  level_id: number;
}