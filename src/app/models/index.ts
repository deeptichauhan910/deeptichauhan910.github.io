export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  budget: number;
  employeeCount: number;
  createdDate: Date;
  updatedDate: Date;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  salary: number;
  hireDate: Date;
  status: 'Active' | 'Inactive' | 'On Leave';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdDate: Date;
  updatedDate: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchCriteria {
  searchTerm: string;
  departmentId?: string;
  status?: string;
}