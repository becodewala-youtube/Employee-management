import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Employee, EmployeeFilters } from '../types/employee';

export function useEmployees(filters: EmployeeFilters) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idhai,setIdhai]= useState(null);

/* console.log(employees); */
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/employees', { params: filters });
        setEmployees(response.data.employees);
        /* const idhai =response.data.employees[0]._id */
        setIdhai(response.data.employees[0]._id);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, totalPages, isLoading, error ,idhai};
}