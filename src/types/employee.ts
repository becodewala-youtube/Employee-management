export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: 'male' | 'female' | 'other';
  course: string[];
  imageUrl: string;
  createdDate: string;
}

export interface EmployeeFilters {
  search?: string;
  gender?: string;
  course?: string;
  designation?: string;
  sortBy?: 'name' | 'email' | 'createdDate';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}