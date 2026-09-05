const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getTaskStats);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title').trim().notEmpty().withMessage('Task title is required'),
      body('status')
        .optional()
        .isIn(['TODO', 'IN_PROGRESS', 'COMPLETED'])
        .withMessage('Invalid status value'),
      body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Invalid priority value'),
      validate
    ],
    createTask
  );

router
  .route('/:id')
  .get(getTaskById)
  .put(
    [
      body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
      body('status')
        .optional()
        .isIn(['TODO', 'IN_PROGRESS', 'COMPLETED'])
        .withMessage('Invalid status value'),
      body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Invalid priority value'),
      validate
    ],
    updateTask
  )
  .delete(deleteTask);

router.patch(
  '/:id/status',
  [
    body('status')
      .notEmpty()
      .isIn(['TODO', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Invalid status value'),
    validate
  ],
  updateTaskStatus
);

module.exports = router;
