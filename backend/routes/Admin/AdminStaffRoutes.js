import express from 'express';


import {
    addStaff,
    updateStaff,
    getAllStaff,
    getStaffById,
    deleteStaff,
    searchStaffByName ,
    getStaffCount
} from '../../controllers/Admin/AdminStaffController.js';  // Correct path to Staff controller

const router = express.Router();
//get staff count

router.get('/count',getStaffCount)
// Route to add a new staff member
router.get('/search', searchStaffByName);  // Add this line

router.post('/Addstaff', addStaff);

// Route to update an existing staff member by ID
router.put('/:staffId', updateStaff);

// Route to retrieve all staff members
router.get('/', getAllStaff);

// Route to retrieve a specific staff member by ID
router.get('/:staffId', getStaffById);

// Route to delete a staff member by ID
router.delete('/:staffId', deleteStaff);


export default router;
