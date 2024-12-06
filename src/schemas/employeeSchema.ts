import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid mobile number'),
  designation: z.string().min(1, 'Designation is required'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  course: z.array(z.string()).min(1, 'Select at least one course'),
  image: z.instanceof(File).optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;