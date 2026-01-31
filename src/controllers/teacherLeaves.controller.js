// controllers/teacherLeaves.controller.js
const teacherLeavesService = require('../services/teacherLeaves.service');
const {
  createLeaveValidation,
  updateLeaveValidation,   
  rejectLeaveValidation
} = require('../validations/teacherLeaves.validation');
const statusCode = require('../enums/statusCode');
const apiResponse = require('../utils/apiResponse');

const createLeave = async (req, res) => {
  try {
    const { error } = createLeaveValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    const leave = await teacherLeavesService.createLeave(req.body);

    return res.status(statusCode.CREATED).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.CREATED,
        result: leave,
        message: 'Leave request created successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while creating leave request'
      })
    );
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await teacherLeavesService.getAllLeaves();

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leaves,
        message: 'Leaves retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching leaves'
      })
    );
  }
};

const getLeaveById = async (req, res) => {
  try {
    const leave = await teacherLeavesService.getLeaveById(req.params.id);

    if (!leave) {
      return res.status(statusCode.NOT_FOUND).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.NOT_FOUND,
          result: null,
          message: 'Leave not found'
        })
      );
    }

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leave,
        message: 'Leave retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching leave'
      })
    );
  }
};

const getLeavesByTeacherId = async (req, res) => {
  try {
    const leaves = await teacherLeavesService.getLeavesByTeacherId(req.params.teacher_id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leaves,
        message: 'Leaves retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching leaves'
      })
    );
  }
};

const getLeavesByStatus = async (req, res) => {
  try {
    const leaves = await teacherLeavesService.getLeavesByStatus(req.params.status);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leaves,
        message: 'Leaves retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching leaves'
      })
    );
  }
};

const updateLeave = async (req, res) => {
  try {
    const { error } = updateLeaveValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    const leave = await teacherLeavesService.updateLeave(req.params.id, req.body);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leave,
        message: 'Leave updated successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while updating leave'
      })
    );
  }
};

const approveLeave = async (req, res) => {
  try {
    // Get admin ID from authenticated request (set by verifyInstituteAdminToken middleware)
    if (!req.instituteAdmin || !req.instituteAdmin._id) {
      return res.status(statusCode.UNAUTHORIZED).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.UNAUTHORIZED,
          result: null,
          message: 'Authentication required to approve leave'
        })
      );
    }

    const adminId = req.instituteAdmin._id;

    const leave = await teacherLeavesService.approveLeave(req.params.id, adminId);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leave,
        message: 'Leave approved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while approving leave'
      })
    );
  }
};

const rejectLeave = async (req, res) => {
  try {
    const { error } = rejectLeaveValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    // Get admin ID from authenticated request (set by verifyInstituteAdminToken middleware)
    if (!req.instituteAdmin || !req.instituteAdmin._id) {
      return res.status(statusCode.UNAUTHORIZED).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.UNAUTHORIZED,
          result: null,
          message: 'Authentication required to reject leave'
        })
      );
    }

    const adminId = req.instituteAdmin._id;

    const leave = await teacherLeavesService.rejectLeave(
      req.params.id,
      adminId,
      req.body.rejection_reason
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: leave,
        message: 'Leave rejected successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while rejecting leave'
      })
    );
  }
};

const deleteLeave = async (req, res) => {
  try {
    const result = await teacherLeavesService.deleteLeave(req.params.id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: result,
        message: 'Leave deleted successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while deleting leave'
      })
    );
  }
};

module.exports = {
  createLeave,
  getAllLeaves,
  getLeaveById,
  getLeavesByTeacherId,
  getLeavesByStatus,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave
};


































































// const teacherLeavesService = require('../services/teacherLeaves.service');
// const {
//   createLeaveValidation,
//   updateLeaveValidation,   
//   approveLeaveValidation,
//   rejectLeaveValidation
// } = require('../validations/teacherLeaves.validation');
// const statusCode = require('../enums/statusCode'); 


// const createLeave = async (req, res) => {
//   try {
//     const { error } = createLeaveValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }


//     const leave = await teacherLeavesService.createLeave(req.body);

//     return res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: leave,
//       message: 'Leave request created successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while creating leave request'
//     });
//   }
// };

// const getAllLeaves = async (req, res) => {
//   try {
//     const leaves = await teacherLeavesService.getAllLeaves();

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leaves,
//       message: 'Leaves retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching leaves'
//     });
//   }
// };

// const getLeaveById = async (req, res) => {
//   try {
//     const leave = await teacherLeavesService.getLeaveById(req.params.id);

//     if (!leave) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.NOT_FOUND,
//         result: null,
//         message: 'Leave not found'
//       });
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leave,
//       message: 'Leave retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching leave'
//     });
//   }
// };

// const getLeavesByTeacherId = async (req, res) => {
//   try {
//     const leaves = await teacherLeavesService.getLeavesByTeacherId(req.params.teacher_id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leaves,
//       message: 'Leaves retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching leaves'
//     });
//   }
// };

// const getLeavesByStatus = async (req, res) => {
//   try {
//     const leaves = await teacherLeavesService.getLeavesByStatus(req.params.status);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leaves,
//       message: 'Leaves retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching leaves'
//     });
//   }
// };

// const updateLeave = async (req, res) => {
//   try {
//     const { error } = updateLeaveValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const leave = await teacherLeavesService.updateLeave(req.params.id, req.body);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leave,
//       message: 'Leave updated successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while updating leave'
//     });
//   }
// };

// const approveLeave = async (req, res) => {
//   try {
//     const { error } = approveLeaveValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const leave = await teacherLeavesService.approveLeave(req.params.id, req.body.approved_by);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leave,
//       message: 'Leave approved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while approving leave'
//     });
//   }
// };

// const rejectLeave = async (req, res) => {
//   try {
//     const { error } = rejectLeaveValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const leave = await teacherLeavesService.rejectLeave(
//       req.params.id,
//       req.body.approved_by,
//       req.body.rejection_reason
//     );

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: leave,
//       message: 'Leave rejected successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while rejecting leave'
//     });
//   }
// };

// const deleteLeave = async (req, res) => {
//   try {
//     const result = await teacherLeavesService.deleteLeave(req.params.id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'Leave deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting leave'
//     });
//   }
// };

// module.exports = {
//   createLeave,
//   getAllLeaves,
//   getLeaveById,
//   getLeavesByTeacherId,
//   getLeavesByStatus,
//   updateLeave,
//   approveLeave,
//   rejectLeave,
//   deleteLeave
// };

