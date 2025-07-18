interface MissingCheckInResponse {
  code: number;
  message: string;
  status: string;
  data: {
    unit_id: number;
    lessons: {
      model_id: number;
      level_id: number;
      level_order: number,
      unit_id: number;
      unit_order: number;
      lesson_id: number;
      lesson_name: string;
      lesson_order: number;
      class_id: number;
      class_name: string;
      class_code: string;
      school_name: string;
      teacher_id: number;
      teacher_name: string;
      teacher_email: string;
    }[];
  }[];
}