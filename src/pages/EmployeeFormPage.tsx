import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, type EmployeeFormData } from '../schemas/employeeSchema';
import { ImageUpload } from '../components/ImageUpload';
import api from '../lib/axios';

const COURSES = [
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'Java',
  'DevOps',
] as const;

const DESIGNATIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Product Manager',
  'Designer',
  'QA Engineer',
] as const;

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string>();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      course: [],
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          const response = await api.get(`/api/employees/${id}`);
          const employee = response.data;

          Object.keys(employee).forEach((key) => {
            if (key !== 'image') {
              setValue(key as keyof EmployeeFormData, employee[key]);
            }
          });

          if (employee.imageUrl) {
            setImagePreview(employee.imageUrl);
          }
        } catch (error) {
          console.error("Failed to fetch employee details:", error);
          alert('Failed to fetch employee details');
          navigate('/employees');
        }
      };

      fetchEmployee();
    }
  }, [id, setValue, navigate, isEditMode]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'course') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (isEditMode) {
        const response = await api.put(`/api/employees/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Employee updated:", response.data);
      } else {
        const response = await api.post('/api/employees', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("New employee added:", response.data);
      }

      navigate('/employees');
    } catch (error) {
      console.error("Error during form submission:", error);
      alert('Failed to save employee');
    }
  };

  const handleImageChange = (file: File) => {
    setValue('image', file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Edit Employee' : 'Add New Employee'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <ImageUpload
            onChange={handleImageChange}
            error={errors.image?.message}
            preview={imagePreview}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile
            </label>
            <input
              type="tel"
              {...register('mobile')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <select
              {...register('designation')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select designation</option>
              {DESIGNATIONS.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
            {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-2 space-y-2">
              {['male', 'female', 'other'].map((gender) => (
                <div key={gender} className="flex items-center">
                  <input
                    type="radio"
                    {...register('gender')}
                    value={gender}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-3 block text-sm text-gray-700 capitalize">{gender}</label>
                </div>
              ))}
            </div>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Courses</label>
            <div className="mt-2 space-y-2">
              {COURSES.map((course) => (
                <div key={course} className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('course')}
                    value={course}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-3 block text-sm text-gray-700">{course}</label>
                </div>
              ))}
            </div>
            {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course.message}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
