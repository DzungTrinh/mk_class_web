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