import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { Table } from '../components/Table';
import { SearchBar } from '../components/SearchBar';
import { useEmployees } from '../hooks/useEmployees';
import { Employee } from '../types/employee';
import { format } from 'date-fns';
import api from '../lib/axios';

export default function EmployeeListPage() {

  
  
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    gender: '',
    designation: '',
    course: '',
    sortBy: 'name' as const,
    sortOrder: 'asc' as const,
  });

 

  const { employees, totalPages, isLoading, error } = useEmployees({
    search,
    page: currentPage,
    limit: 10,
    ...filters,
  });
/* console.log(idhai); */
  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof Employee,
      render: (value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, employee: Employee) => (
        <div className="flex items-center">
          <img
            src={employee.imageUrl}
            alt={String(value)}
            className="h-10 w-10 rounded-full mr-3"
          />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-gray-500">{employee.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Designation',
      accessor: 'designation' as keyof Employee,
    },
    {
      header: 'Mobile',
      accessor: 'mobile' as keyof Employee,
    },
    {
      header: 'Created Date',
      accessor: 'createdAt' as keyof Employee,
      render: (value: any) => {
        try {
          // Ensure the value is a valid date before formatting
          const date = new Date(String(value));
          if (isNaN(date.getTime())) {
            return 'Invalid Date'; // Fallback for invalid dates
          }
          return format(date, 'MMM d, yyyy');
        } catch {
          return 'Invalid Date'; // Fallback for errors during formatting
        }
      },
    }
    ,
    {
      header: 'Actions',
      accessor: '_id' as keyof Employee,
      render: (value: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/employees/${value}/edit`)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDelete(String(value))}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];
  

  const handleDelete = async (_id: string) => {
    /* console.log(employees) */
 /*    console.log(_id); */
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/api/employees/${_id}`);
      /*   console.log(idhai); */
        // Refresh the employee list
        setCurrentPage(1);
      } catch (error) {
        alert('Failed to delete employee');
      }
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
        <button
          onClick={() => navigate('/employees/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search employees..."
          />
        </div>
        <select
          value={filters.designation}
          onChange={(e) =>
            setFilters({ ...filters, designation: e.target.value })
          }
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Designations</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Designer">Designer</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <Table
          data={employees}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}