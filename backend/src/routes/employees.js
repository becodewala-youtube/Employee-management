import express from 'express';
import { body, query } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// Get employees with filters and pagination
router.get('/', auth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user._id };

    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') },
      ];
    }

    if (req.query.gender) query.gender = req.query.gender;
    if (req.query.designation) query.designation = req.query.designation;
    if (req.query.course) query.course = req.query.course;

    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
    }

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Employee.countDocuments(query),
    ]);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    next(error);
  }
});

// Create employee
router.post('/',
  auth,
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('mobile').matches(/^\+?[1-9]\d{9,14}$/).withMessage('Invalid mobile number'),
    body('designation').notEmpty().withMessage('Designation is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('course').isArray().withMessage('Courses must be an array'),
  ],
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Profile picture is required' });
      }

      const imageUrl = await uploadToCloudinary(req.file);
      const employee = new Employee({
        ...req.body,
        course: JSON.parse(req.body.course),
        imageUrl,
        createdBy: req.user._id,
      });

      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }
);


// get employee details
router.get('/:id',auth,async(req, res, next)=>{
  try{
    const employee = await Employee.findOne({
      _id: req.params.id,
      createdBy:req.user._id,
    });
    if(!employee){
      return res.status(404).json({error: 'Employee Not Found'});
    }
    res.json(employee);
  }catch(error){
    next(error);
  }

  }
);



// Update employee
router.put('/:id',
  auth,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const employee = await Employee.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
      });

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      const updates = { ...req.body };
      if (req.body.course) {
        updates.course = JSON.parse(req.body.course);
      }

      if (req.file) {
        updates.imageUrl = await uploadToCloudinary(req.file);
      }

      Object.assign(employee, updates);
      await employee.save();
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }
);

// Delete employee
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;