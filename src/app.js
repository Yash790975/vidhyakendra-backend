const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
mongoose.pluralize(null); // Disable pluralization globally




const {UPLOADS_ROOT}=require("./middlewares/upload.js");

const adminRoutes=require("./routes/admin.routes.js");


const app = express();

// Security middleware
app.use(helmet()); 

app.use(cors());

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));



app.use("/sms/uploads", express.static(UPLOADS_ROOT, {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));


app.use(morgan('combined'));

app.use("/sms/admin",adminRoutes);
app.use('/sms/super-admin-notices', require('./routes/superAdminNotices.routes'));


// Routes
app.use('/sms/subscription-plans', require('./routes/subscriptionPlanMaster.routes'));
app.use('/sms/plan-variants', require('./routes/subscriptionPlanVariant.routes'));
app.use('/sms/onboarding', require('./routes/onboardingBasicInformation.routes'));
app.use('/sms/institute-details', require('./routes/onboardingInstituteDetails.routes'));

// Onboarding Transaction Routes
app.use('/sms/onboarding-transactions', require('./routes/onboardingTransactions.routes'));
 
// Institute Management Routes  
app.use('/sms/institutes', require('./routes/institutes.routes'));
app.use('/sms/institute-basic-info', require('./routes/instituteBasicInfo.routes')); 
app.use('/sms/institute-details-master', require('./routes/instituteDetailsMaster.routes')); 
app.use('/sms/notices', require('./routes/notices.routes'));
// Document Management Routes   
app.use('/sms/institute-documents', require('./routes/instituteDocuments.routes.js'));
app.use('/sms/institute-identity-documents', require('./routes/instituteIdentityDocuments.routes.js')); 

// Subscription Transaction Routes
app.use('/sms/subscription-transactions', require('./routes/subscriptionTransactions.routes'));

// Institute Admins
app.use('/sms/institute-admin', require('./routes/instituteAdmin.routes'));


// Teacher Management Routes 
app.use('/sms/teachers', require('./routes/teachersMaster.routes'));
app.use('/sms/teacher-addresses', require('./routes/teacherAddresses.routes'));
app.use('/sms/teacher-bank-details', require('./routes/teacherBankDetails.routes'));
app.use('/sms/teacher-contact-information', require('./routes/teacherContactInformation.routes'));
app.use('/sms/teacher-emergency-contacts', require('./routes/teacherEmergencyContacts.routes'));
app.use('/sms/teacher-experience', require('./routes/teacherExperience.routes'));
app.use('/sms/teacher-identity-documents', require('./routes/teacherIdentityDocuments.routes'));
app.use('/sms/teacher-qualification-details', require('./routes/teacherQualificationDetails.routes'));
app.use('/sms/teacher-auth', require('./routes/teacherAuth.routes'));

// app.use('/sms/school-teacher-role', require('./routes/schoolTeacherRole.routes'));
app.use('/sms/coaching-teacher-detail', require('./routes/coachingTeacherDetail.routes'));

app.use('/sms/teacher-salary-structure', require('./routes/teacherSalaryStructure.routes'));
app.use('/sms/teacher-salary-transactions', require('./routes/teacherSalaryTransactions.routes'));
app.use('/sms/teacher-attendance', require('./routes/teacherAttendance.routes'));
app.use('/sms/teacher-leaves', require('./routes/teacherLeaves.routes'));


//Subjects Managment
app.use('/sms/subjects-master', require('./routes/subjectsMaster.routes'));
app.use('/sms/subjects-by-class', require('./routes/subjectsByClass.routes.js'));
// app.use('/sms/teacher-subjects', require('./routes/teacherSubjects.routes'));


//Student Management Routes

app.use("/sms/students", require("./routes/studentsMaster.routes")); 
app.use("/sms/student-contact-information", require("./routes/studentContactInformation.routes"));
app.use("/sms/student-auth", require("./routes/studentAuth.routes"));
app.use("/sms/student-addresses", require("./routes/studentAddresses.routes"));
app.use("/sms/student-guardians", require("./routes/studentGuardians.routes"));
app.use("/sms/student-identity-documents", require("./routes/studentIdentityDocuments.routes"));
app.use("/sms/student-academic-documents", require("./routes/studentAcademicDocuments.routes"));
app.use("/sms/student-academic-mapping", require("./routes/studentAcademicMapping.routes"));
app.use("/sms/student-attendance", require("./routes/studentAttendance.routes"));
app.use("/sms/student-status-history", require("./routes/studentStatusHistory.routes"));

//Acadmics
app.use("/sms/classes", require("./routes/classesMaster.routes"));
app.use("/sms/class-sections", require("./routes/classSections.routes"));
app.use("/sms/coaching-batches", require("./routes/coachingBatches.routes"));
app.use("/sms/class-subjects", require("./routes/classSubjects.routes"));
app.use("/sms/class-subject-schedule", require("./routes/classSubjectSchedule.routes"));
app.use("/sms/class-teacher-assignments", require("./routes/classTeacherAssignments.routes"));


app.use("/sms/homework-assignments", require("./routes/homeworkAssignments.routes"))
app.use("/sms/homework-submissions", require("./routes/homeworkSubmissions.routes"))
app.use("/sms/exams-master", require("./routes/examsMaster.routes.js"))
app.use("/sms/exam-schedules", require("./routes/examSchedules.routes.js"))
app.use("/sms/student-exam-results", require("./routes/studentExamResults.routes.js"))






// app.use(notFound);   

// app.use(errorHandler);   

module.exports = app;