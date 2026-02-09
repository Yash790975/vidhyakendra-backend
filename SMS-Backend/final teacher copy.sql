db.createCollection("teachers_master", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "teacher_code",
        "teacher_type",
        "full_name",
        "gender",
        "date_of_birth",
        "employment_type", 
        "status",
        "created_at"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId",
          description: "FK → institutes_master._id"
        },

        teacher_code: {
          bsonType: "string", 
          description: "Unique institute-level teacher code" --
        },
        
        teacher_type: {
          bsonType: "string",
          enum: ["school", "coaching"]
        },

        full_name: { bsonType: "string" },

        gender: {
          bsonType: "string",
          enum: ["male", "female", "other"]
        },

        date_of_birth: { bsonType: "date" },

        marital_status: {
          bsonType: "string",
          enum: ["single", "married", "divorced", "widowed"]
        },

        spouse_name: { bsonType: ["string", "null"] },

        employment_type: {
          bsonType: "string",
          enum: ["full_time", "part_time", "contract", "visiting"]
        },

        joining_date: { bsonType: "date" },

        status: {
          bsonType: "string",
          enum: ["active", "inactive", "blocked", "archived"]
        },
        archived_at: { bsonType: "date" },
     
        

        blood_group: { bsonType: ["string", "null"] }
         }
    }
  }
});

db.teachers_master.createIndex(
  { institute_id: 1, teacher_code: 1 },
  { unique: true }
);

--if this error came
-- {
--     "success": false,
--     "isException": true,
--     "statusCode": 500,
--     "result": null,
--     "message": "Document failed validation"
-- }



-- db.runCommand({
--   collMod: "teachers_master",
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: [
--         "institute_id",
--         "teacher_code",
--         "teacher_type",
--         "full_name",
--         "gender",
--         "date_of_birth",
--         "employment_type",
--         "status",
--         "createdAt"
--       ],
--       properties: {
--         institute_id: { bsonType: "objectId" },
--         teacher_code: { bsonType: "string" },
--         teacher_type: { bsonType: "string", enum: ["school", "coaching"] },
--         full_name: { bsonType: "string" },
--         gender: { bsonType: "string", enum: ["male", "female", "other"] },
--         date_of_birth: { bsonType: "date" },
--         marital_status: { bsonType: ["string", "null"] },
--         spouse_name: { bsonType: ["string", "null"] },
--         employment_type: { bsonType: "string", enum: ["full_time", "part_time", "contract", "visiting"] },
--         joining_date: { bsonType: ["date", "null"] },
--         status: { bsonType: "string", enum: ["active", "inactive", "blocked", "archived"] },
--         archived_at: { bsonType: ["date", "null"] },
--         blood_group: { bsonType: ["string", "null"] },
--         createdAt: { bsonType: "date" },
--         updatedAt: { bsonType: ["date", "null"] }
--       }
--     }
--   },
--   validationLevel: "moderate"
-- });





-- teacher_code -> Using institute_name → acronym makes the code
-- <INSTITUTE_ACRONYM>-<TEACHER_TYPE>-TCH-<RUNNING_NUMBER>

-- Example:-
-- Institute name: "Shree Bhoj Vidhya Peeth High School"
-- Acronym → SBVPHS
-- Teacher code → SBVPHS-SCH-TCH-001


 


db.createCollection("teacher_contact_information", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "mobile", "email"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        mobile: { bsonType: "string" },
        email: { bsonType: "string" },

        alternate_mobile: { bsonType: "string" },

        email_verified: { bsonType: "bool" },
        mobile_verified: { bsonType: "bool" }
      }
    }
  }
});
-- For this schema- In servive file logic, for initially "email_verified" and "mobile_verified" both should be 'false'.
-- For setting both 'true' we have to use nodemailer to verify the email and mobile, we sent otp on entered email and then send it to 'email' of entered teacher email, then when the teacher verify the OTP then we set both this properties to 'true'.




db.createCollection("teacher_addresses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "address_type", "address"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        address_type: {
          bsonType: "string",
          enum: ["current", "permanent"]
        },

        address: { bsonType: "string" },
        city: { bsonType: "string" },
        state: { bsonType: "string" },
        pincode: { bsonType: "string" }
      }
    }
  }
});



db.createCollection("teacher_identity_documents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "teacher_id", 
        "document_type",
        "document_number",
        "verification_status",
        "file_url"
      ],
      properties: {
        teacher_id: { bsonType: "objectId" },

        document_type: {
          bsonType: "string",
          enum: [
            "pan_card",
            "address_card",
            "photo"
            ]
        },

        document_number: {
          bsonType: "string",
          description: "Encrypted value"
        },

        masked_number: {
          bsonType: "string",
          description: "XXXX-XXXX-1234"
        },

        verification_status: {
          bsonType: "string",
          enum: ["pending", "approved", "rejected"]
        },
        file_url: { bsonType: "string" },

        verified_by: { bsonType: "objectId" },
        rejection_reason: { bsonType: "string" }
      }
    }
  }
});

db.teacher_identity_documents.createIndex(
  { teacher_id: 1, document_type: 1 },
  { unique: true }
);
--'teacher_identity_documents'  in this schema we have 'file_url' make sure about that we have to handle image as we do in 'institute_identity_documents' and 'institute_documents'





db.createCollection("teacher_qualification_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "qualification","file_url"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        qualification: { bsonType: "string" },
        specialization: { bsonType: "string" },
        file_url : {bsonType:"string"},
        institute_name: { bsonType: "string" },
        passing_year: { bsonType: "date" }
      }
    }
  }
});
--'teacher_qualification_details'  in this schema we also have 'file_url' make sure about that we have to handle image as we do in 'institute_identity_documents' and 'institute_documents'




db.createCollection("teacher_experience", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "organization_name"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        organization_name: { bsonType: "string" },
        role: { bsonType: "string" },

        from_date: { bsonType: "date" },
        to_date: { bsonType: ["date", "null"] },

        is_current: { bsonType: "bool" }
      }
    }
  }
});

 
____________________________________________________________________________________


db.createCollection("teacher_bank_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "teacher_id",
        "account_holder_name",
        "account_number",
        "ifsc_code"
      ],
      properties: {
        teacher_id: { bsonType: "objectId" },

        account_holder_name: { bsonType: "string" },
        bank_name: { bsonType: "string" },
        account_number: { bsonType: "string" },
        ifsc_code: { bsonType: "string" },

        upi_id: { bsonType: ["string", "null"] },
        is_primary: { bsonType: "bool" }
      }
    }
  }
});

____________________________________________________________________________________


db.createCollection("teacher_emergency_contacts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "name", "relation", "mobile"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        name: { bsonType: "string" },
        relation: { bsonType: "string" },
        mobile: { bsonType: "string" }
      }
    }
  }
});

____________________________________________________________________________________


db.createCollection("teacher_auth", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "email", "password_hash", "status"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        email: { bsonType: "string" },     
        mobile: { bsonType: "string" },

        password_hash: { bsonType: "string" },
        password_key: { bsonType: "string" },

        is_first_login: { bsonType: "bool" },

        last_login_at: { bsonType: "date" },

        status: {
          bsonType: "string",
          enum: ["active", "blocked", "disabled"]
        }
      }
    }
  }
});

--if this error came
-- {
--     "success": false,
--     "isException": true,
--     "statusCode": 500,
--     "result": null,
--     "message": "Document failed validation"
-- }

-- Run this MongoDB command to update your validator:

-- db.runCommand({
--   collMod: "teacher_auth",
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["teacher_id", "email", "password_hash", "status"],
--       properties: {
--         teacher_id: { bsonType: "objectId" },
--         email: { bsonType: "string" },     
--         mobile: { bsonType: ["string", "null"] },
--         password_hash: { bsonType: "string" },
--         password_key: { bsonType: ["string", "null"] },
--         is_first_login: { bsonType: "bool" },
--         last_login_at: { bsonType: ["date", "null"] },
--         status: {
--           bsonType: "string",
--           enum: ["active", "blocked", "disabled"]
--         },
--         otp: { bsonType: ["string", "null"] },
--         otp_expiry: { bsonType: ["date", "null"] },
--         created_at: { bsonType: "date" },
--         updated_at: { bsonType: "date" }
--       }
--     }
--   },
--   validationLevel: "moderate"
-- });




-- (ONLY for schools)
db.createCollection("school_teacher_roles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "role_type"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        role_type: {
          bsonType: "string",
          enum: [
            "principal",
            "vice_principal",
            "class_teacher",
            "subject_teacher",
            "lab_assistant"
          ]
        },

        assigned_class: { bsonType: "string" },
        assigned_section: { bsonType: "string" },
        section: { bsonType: ["string", "null"] },
        subjects: {
          bsonType: ["array", "null"],
          items: { bsonType: "string" }
        }
      }
    }
  }
});

db.createCollection("coaching_teacher_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "role"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        role: {
          bsonType: "string",   enum: [
            "mentor",
            "faculty",
            "guest_faculty",
            "counsellor"
          ]
        },

        subjects: {
          bsonType: ["array", "null"],
          items: { bsonType: "string" }
        },

        batch_ids: {
          bsonType: ["array", "null"],
          items: { bsonType: "objectId" }
        },

        payout_model: {
          bsonType: ["string", "null"],
          enum: ["fixed", "percentage"]
        }
      }
    }
  }
});


-- need to be add more tables related to documents salary payout transactions and all




-- new tables related to teacher for both school and coaching 19-01-2026

db.createCollection("teacher_salary_structure", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "teacher_id",
        "salary_type",
        "pay_frequency",
        "currency",
        "effective_from",
        "status",
        "created_at"
      ],
      properties: {
        teacher_id: {
          bsonType: "objectId",
          description: "FK → teachers_master._id"
        },
        salary_type: {
          bsonType: "string",
          enum: [
            "fixed_monthly",
            "per_lecture",
            "hourly",
            "percentage",
            "hybrid"
          ]
        },
        pay_frequency: {
          bsonType: "string",
          enum: ["monthly", "weekly", "bi_weekly", "per_session"]
        },
        currency: {
          bsonType: ["string","null"],
          description: "ISO currency code (e.g. INR, USD) for now will go for INR "
        },
        basic_salary: { bsonType: ["number", "null"] },
        hra: { bsonType: ["number", "null"] },
        da: { bsonType: ["number", "null"] },
        conveyance_allowance: { bsonType: ["number", "null"] },
        medical_allowance: { bsonType: ["number", "null"] },
        per_lecture_rate: { bsonType: ["number", "null"] },
        hourly_rate: { bsonType: ["number", "null"] },
        revenue_percentage: {
          bsonType: ["number", "null"],
          description: "Used in coaching institutes"
        },

        incentive_amount: { bsonType: ["number", "null"] },
        bonus_amount: { bsonType: ["number", "null"] },
        max_lectures_per_month: { bsonType: ["int", "null"] },
        max_hours_per_month: { bsonType: ["int", "null"] },
        pf_applicable: { bsonType: "bool" },
        pf_percentage: { bsonType: ["number", "null"] },
        tds_applicable: { bsonType: "bool" },
        tds_percentage: { bsonType: ["number", "null"] },
        other_deductions: {
          bsonType: ["array", "null"],
          items: {
            bsonType: "object",
            required: ["name", "amount"],
            properties: {
              name: { bsonType: "string" },
              amount: { bsonType: "number" }
            }
          }
        },
        effective_from: { bsonType: "date" },
        effective_to: { bsonType: ["date", "null"] },
        approved_by: { bsonType: ["objectId", "null"] },
        approved_at: { bsonType: ["date", "null"] },
        remarks: { bsonType: ["string", "null"] },
        status: {
          bsonType: "string",
          enum: ["active", "inactive", "archived"]
        },
        archived_at: { bsonType: ["date", "null"] },
      }
    }
  }
});

-- in this table the reference_id id will be changed in future depending upon the requirement when payment is integrated
db.createCollection("teacher_salary_transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "amount", "payment_month", "status"],
      properties: {
        teacher_id: { bsonType: "objectId" },
        amount: { bsonType: "number" },
        payment_month: { bsonType: "string" }, // YYYY-MM
        payment_date: { bsonType: "date" },

        payment_mode: {
          bsonType: "string",
          enum: ["bank_transfer", "upi", "cash"]
        },

        reference_id: { bsonType: "string" },

        status: {
          bsonType: "string",
          enum: ["pending", "paid", "failed"]
        }
      }
    }
  }
});

-- This operation is by admin 
db.createCollection("teacher_attendance", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "date", "status"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        date: { bsonType: "date" },

        status: {
          bsonType: "string",
          enum: ["present", "absent", "half_day", "leave"]
        },

        check_in_time: { bsonType: ["date", "null"] },
        check_out_time: { bsonType: ["date", "null"] },

        remarks: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("teacher_leaves", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "leave_type", "from_date", "to_date", "status"],
      properties: {
        teacher_id: { bsonType: "objectId" },

        leave_type: {
          bsonType: "string",
          enum: [
            "casual",
            "sick",
            "paid",
            "unpaid",
            "earned",            
            "maternity",
            "paternity",       
            "bereavement",
            "marriage",
            "study",
            "work_from_home",
            "half_day",
            "optional_holiday",
            "restricted_holiday"
          ]
        }


        from_date: { bsonType: "date" },
        to_date: { bsonType: "date" },

        reason: { bsonType: "string" },
  
        status: {
          bsonType: "string",
          enum: ["pending", "approved", "rejected"]
        },
           
        approved_by: { bsonType: "objectId",
        description : "this approved by is associated with admins table of institute"}
      }
    }
  }
});

db.createCollection("subjects_master", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "subject_name",
        "subject_type",
        "status",
        "created_at"
      ],
      properties: {

        institute_id: {
          bsonType: "objectId",
          description: "FK → institutes_master._id"
        },

        subject_name: {
          bsonType: "string",
          description: "e.g. Mathematics, Physics, IIT Physics"
        },

        subject_code: {
          bsonType: ["string", "null"],
          description: "Optional short code (MATH101)"-- For now will go for random number between 3-5 but after finalize we have to go for numbersize
        },

        subject_type: {
          bsonType: "string",
          enum: ["school", "coaching", "both"]
        },

        /* ===== School-specific ===== */
        class_levels: {
          bsonType: ["array", "null"],
          items: { bsonType: "string" },
          description: "e.g. ['Class 9', 'Class 10']"
        },

        stream: {
          bsonType: ["string", "null"],
          enum: ["science", "commerce", "arts", null]
        },

        /* ===== Coaching-specific ===== */
        exam_type: {
          bsonType: ["array", "null"],
          items: { bsonType: "string" },
          description: "e.g. ['IIT-JEE', 'NEET']"
        },

        description: {
          bsonType: ["string", "null"]
        },

        status: {
          bsonType: "string",
          enum: ["active", "inactive", "archived"]
        },

        created_at: { bsonType: "date" },
        updated_at: { bsonType: ["date", "null"] }
      }
    }
  }
});

db.createCollection("teacher_subjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "subject_id"],
      properties: {
        teacher_id: { bsonType: "objectId" },
        subject_id: { bsonType: "objectId" },  -- FK → subjects_master
        is_primary: { bsonType: "bool" }
      }
    }
  }
});

