
const teacherAttendanceService = require('../services/teacherAttendance.service');
const {
  createAttendanceValidation,
  updateAttendanceValidation
} = require('../validations/teacherAttendance.validation');
const statusCode = require('../enums/statusCode');

const createAttendance = async (req, res) => {
  try {
    const { error } = createAttendanceValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const attendance = await teacherAttendanceService.createAttendance(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: attendance,
      message: 'Attendance created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating attendance'
    });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await teacherAttendanceService.getAllAttendance();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: attendance,
      message: 'Attendance retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching attendance'
    });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await teacherAttendanceService.getAttendanceById(req.params.id);

    if (!attendance) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Attendance not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: attendance,
      message: 'Attendance retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching attendance'
    });
  }
};

const getAttendanceByTeacherId = async (req, res) => {
  try {
    const attendance = await teacherAttendanceService.getAttendanceByTeacherId(req.params.teacher_id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: attendance,
      message: 'Attendance retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching attendance'
    });
  }
};

const getAttendanceByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const attendance = await teacherAttendanceService.getAttendanceByDate(date);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: attendance,
      message: 'Attendance retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching attendance'
    });
  }
};

const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Start date and end date are required'
      });
    }

    const attendance = await teacherAttendanceService.getAttendanceByDateRange(
      new Date(startDate),
      new Date(endDate)
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: attendance,
      message: 'Attendance retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching attendance'
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { error } = updateAttendanceValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const attendance = await teacherAttendanceService.updateAttendance(req.params.id, req.body);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: attendance,
      message: 'Attendance updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating attendance'
    });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const result = await teacherAttendanceService.deleteAttendance(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Attendance deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting attendance'
    });
  }
};

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  getAttendanceByTeacherId,
  getAttendanceByDate,
  getAttendanceByDateRange,
  updateAttendance,
  deleteAttendance
};

































































// const teacherAttendanceService = require('../services/teacherAttendance.service');
// const {
//   createAttendanceValidation,
//   updateAttendanceValidation
// } = require('../validations/teacherAttendance.validation');
// const statusCode = require('../enums/statusCode');

// const createAttendance = async (req, res) => {
//   try {
//     const { error } = createAttendanceValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const attendance = await teacherAttendanceService.createAttendance(req.body);

//     return res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: attendance,
//       message: 'Attendance created successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while creating attendance'
//     });
//   }
// };

// const getAllAttendance = async (req, res) => {
//   try {
//     const attendance = await teacherAttendanceService.getAllAttendance();

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: attendance,
//       message: 'Attendance retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching attendance'
//     });
//   }
// };

// const getAttendanceById = async (req, res) => {
//   try {
//     const attendance = await teacherAttendanceService.getAttendanceById(req.params.id);

//     if (!attendance) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.NOT_FOUND,
//         result: null,
//         message: 'Attendance not found'
//       });
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: attendance,
//       message: 'Attendance retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching attendance'
//     });
//   }
// };

// const getAttendanceByTeacherId = async (req, res) => {
//   try {
//     const attendance = await teacherAttendanceService.getAttendanceByTeacherId(req.params.teacherId);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: attendance,
//       message: 'Attendance retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching attendance'
//     });
//   }
// };

// const getAttendanceByDate = async (req, res) => {
//   try {
//     const date = new Date(req.params.date);
//     const attendance = await teacherAttendanceService.getAttendanceByDate(date);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: attendance,
//       message: 'Attendance retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching attendance'
//     });
//   }
// };

// const getAttendanceByDateRange = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     if (!startDate || !endDate) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: 'Start date and end date are required'
//       });
//     }

//     const attendance = await teacherAttendanceService.getAttendanceByDateRange(
//       new Date(startDate),
//       new Date(endDate)
//     );

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: attendance,
//       message: 'Attendance retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching attendance'
//     });
//   }
// };

// const updateAttendance = async (req, res) => {
//   try {
//     const { error } = updateAttendanceValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const attendance = await teacherAttendanceService.updateAttendance(req.params.id, req.body);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: attendance,
//       message: 'Attendance updated successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while updating attendance'
//     });
//   }
// };

// const deleteAttendance = async (req, res) => {
//   try {
//     const result = await teacherAttendanceService.deleteAttendance(req.params.id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'Attendance deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting attendance'
//     });
//   }
// };

// module.exports = {
//   createAttendance,
//   getAllAttendance,
//   getAttendanceById,
//   getAttendanceByTeacherId,
//   getAttendanceByDate,
//   getAttendanceByDateRange,
//   updateAttendance,
//   deleteAttendance
// };
