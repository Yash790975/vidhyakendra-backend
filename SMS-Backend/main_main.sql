use vidhyaKendra_db
 

db.createUser({
  user: "vidhyaKendra",
  pwd: "vidhyaKendra123",
  roles: [
    { role: "readWrite", db: "vidhyaKendra" } 
  ]
})

mongosh -u "vidhyaKendra" -p "vidhyaKendra123" 


db.createCollection("subscription_plan_master", {    
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["plan_name", "plan_type", "duration_months"],
      properties: {
        plan_name: {
          bsonType: "string",
          description: "Plan name like Monthly, Quarterly, Yearly"
        },
        plan_type: {
          bsonType: "string", 
          description: "Type of plan e.g. subscription"
        },
        duration_months: {
          bsonType: "int",
          minimum: 1,
          description: "Duration in months"
        },
        description: {
          bsonType: "string"
        },
        is_active: {
          bsonType: "bool"
        },
      }
    }
  }
})


db.subscription_plan_master.createIndex(
  { plan_name: 1 },
  { unique: true }
)

db.subscription_plan_master.createIndex(
  { is_active: 1 }
)



db.createCollection("subscription_plan_variants", { 
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["plan_master_id", "applicable_for", "price"],
      properties: {
        plan_master_id: {
          bsonType: "objectId",
          description: "Reference to subscription_plan_master _id"
        },
        applicable_for: {
          bsonType: "string",
          enum: ["school", "coaching", "both"],
          description: "Applicable institute type"
        },
        price: {
          bsonType: "decimal",
          minimum: 0
        },
        discount_percentage: {
          bsonType: "decimal",
          minimum: 0
        },
        features: {
          bsonType: "object",
          description: "Feature JSON"
        },
        is_active: {
          bsonType: "bool"
        }
      }
    }
  }
})
db.subscription_plan_variants.createIndex(
  { plan_master_id: 1, applicable_for: 1 },
  { unique: true }
)

db.subscription_plan_variants.createIndex(
  { applicable_for: 1 }
)

db.subscription_plan_variants.createIndex(
  { is_active: 1 }
)





---------------------------------------------------------------------------------
-- new latest date 12 of january 2026



















db.createCollection("onboarding_basic_information", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_name",
        "institute_type",
        "owner_name",
        "email",
        "mobile",
        "address"
      ],
      properties: {
        institute_name: {
          bsonType: "string",
          description: "Name of the institute"
        },
        institute_type: {
          bsonType: "string",
          enum: ["school", "coaching", "both"],
          description: "Institute type"
        },
        
        owner_name: {
          bsonType: "string",
          description: "Owner / Principal / Director name"
        },
        designation: {
          bsonType: "string",
          description: "Owner / Principal / Admin"
        },
        email: {
          bsonType: "string",
          description: "Login + communication email"
        },
        mobile: {
          bsonType: "string",
          description: "OTP and alert mobile number"
        },
        address: {
          bsonType: "string",
          description: "Full address"
        },
        mobile_number_verified : {
            bsonType:"bool",
            description:"for mobile number verification"
        },
        is_active: {
          bsonType: "bool"
        },
      }
    }
  }
});








db.createCollection("onboarding_institute_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "onboarding_basic_info_id",
        "classes_offered",
        "medium",
        "approx_students_range"
      ],
      properties: {
        onboarding_basic_info_id: {
          bsonType: "objectId",
          description: "Reference to institutes collection"
        },
        school_board: {
          bsonType: "string",
          description: "CBSE / ICSE / State Board / Other"
        },
        school_type: {
          bsonType: "string",
          enum: ["private", "government", "public"]
        },
        classes_offered: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "e.g. Nursery, KG, 1-12"
        },
        medium: {
          bsonType: "string",
          enum: ["english", "hindi", "other"]
        },
        courses_offered: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Optional courses like Science, Commerce, Arts"
        },
        approx_students_range: {
          bsonType: "string",
          enum: [
            "1-100",
            "101-250",
            "251-500",
            "500-1000",
            "1000+"
          ]
        },
      }
    }
  }
})

--Alter command
db.runCommand({
  collMod: "onboarding_basic_information",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_name",
        "institute_type",
        "owner_name",
        "email",
        "mobile",
        "address"
      ],
      properties: {
        institute_name: {
          bsonType: "string",
          description: "Name of the institute"
        },
        institute_type: {
          bsonType: "string",
          enum: ["school", "coaching", "both"],
          description: "Institute type"
        },
        owner_name: {
          bsonType: "string",
          description: "Owner / Principal / Director name"
        },
        designation: {
          bsonType: "string",
          description: "Owner / Principal / Admin"
        },
        email: {
          bsonType: "string",
          description: "Login + communication email"
        },
        mobile: {
          bsonType: "string",
          description: "OTP and alert mobile number"
        },
        address: {
          bsonType: "string",
          description: "Full address"
        },
        mobile_number_verified: {
          bsonType: "bool",
          description: "for mobile number verification"
        },
        is_active: {
          bsonType: "bool"
        },
        is_archived: {
          bsonType: "bool",
          description: "Onboarding completed and locked"
        },
        archived_at: {
          bsonType: "date",
          description: "When onboarding was completed"
        }
      }
    }
  },
  validationLevel: "moderate"
});




-- new 13 of january 2026
-- this table will be changed




-- Here new tables for ongoing table on-going project create api's for all this also
-- here is the transaction table for onboarding application, currently the payment integration is not done
-- but in future we will integrate payment gateway for receiving payment for onboarding application.

db.createCollection("onboarding_institute_application_transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object", 
      required: [ 
        "reference_id", -- Unique reference ID - we have to generate this using (timestamp + 5 digit random number)
        "onboarding_basic_info_id",
        "subscription_plan_variant_id",
        "amount", 
        "payment_status",
        "application_status" 
      ],
      properties: {
        reference_id: {
          bsonType: "string",
          description: "Unique reference ID shown to user"
        },

        onboarding_basic_info_id: { 
          bsonType: "objectId",
          description: "Link to onboarding_basic_information"
        },

        subscription_plan_variant_id: {
          bsonType: "objectId",
          description: "Selected subscription plan"
        },

        amount: {
          bsonType: "decimal",
          minimum: 0,
          description: "Final payable amount"
        },

        currency: {
          bsonType: "string",
          description: "INR, USD etc"
        },

        payment_gateway: {
          bsonType: "string",
          description: "Razorpay / Stripe / Cashfree"
        },

        payment_transaction_id: {
          bsonType: "string",
          description: "Gateway transaction ID"
        },

        payment_status: {
          bsonType: "string",
          enum: ["pending", "success", "failed", "refunded"],
          description: "Payment status"
        },

        application_status: {
          bsonType: "string",
          enum: [
            "payment_received",
            "documents_under_review",
            "approved",
            "rejected",
            "account_activated"
          ],
          description: "Institute application lifecycle"
        },

        receipt_url: {
          bsonType: "string",
          description: "Receipt PDF link"
        },

        is_active: {
          bsonType: "bool"
        }
      }
    }
  }
});

-- After the onboarding_institute_application_transactions table.
-- Now we are assuming that the onboarding of the user has been completed.
-- When the onboarding is completed we need to do the following steps:
     -- 1. In 'onboarding_basic_information' table, set 'is_archived' to true and set 'archived_at' to current timestamp.
     -- 2. Create a new entry in 'institutes_master' table with relevant details from onboarding, and in 'institutes_master'      table, in 'institute_code' field, set the value to 'VIDHKEND' + 9 digit random number.
     -- 3. Create a new entry in 'institute_basic_information' table with relevant details from onboarding.
     -- 4. Create a new entry in 'institute_details' table with relevant details from onboarding.
     -- 5. Create a new entry in 'institute_subscription_transactions' table with relevant details from onboarding transaction.
-- Next, we need to create login credentials for the user to access the admin panel.
-- In the admin panel,there are two admin panel for both coaching and school
-- for example admin (user) is subscribe for both panel school and coaching 
-- then the credentials will be the same for both 
-- in case of only one subscription the credentials we have to check weather they are on coaching or school

db.createCollection("institutes_master", {      
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_code", -- VIDHKEND + 9 digit random number
        "institute_name",
        "institute_type",
        "status",

      ],
      properties: {
        institute_code: {
          bsonType: "string",
          description: "Unique system-generated code"    
        },

        institute_name: {
          bsonType: "string"
        },

        institute_type: {
          bsonType: "string",
          enum: ["school", "coaching", "both"]
        },

        application_reference_id: {
          bsonType: "string",
          description: "Original onboarding reference"
        },
       status: {
          bsonType: "string",
          enum: [
            "pending_activation",
            "trial",
            "active",
            "suspended",
            "blocked",
            "expired",
            "archived"
          ]
        }
      }
    }
  }
});

db.institutes_master.createIndex({ institute_code: 1 }, { unique: true });
db.institutes_master.createIndex({ institute_type: 1 });
db.institutes_master.createIndex({ status: 1 });

db.createCollection("institute_basic_information", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "owner_name",
        "email",
        "mobile"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId"
        },

        owner_name: {
          bsonType: "string"
        },

        designation: {
          bsonType: "string"
        },

        email: {
          bsonType: "string"
        },

        mobile: {
          bsonType: "string"
        },

        address: {
          bsonType: "string"
        },

        email_verified: {
          bsonType: "bool"
        }, 

        mobile_verified: {
          bsonType: "bool"
        }
      }
    }
  }
});


db.createCollection("institute_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId"
        },

        school_board: {
          bsonType: "string"
        },

          school_type: {
          bsonType: "string",
          enum: ["private", "government", "public"]
        },

        classes_offered: {
          bsonType: "array",
          items: { bsonType: "string" }
        },

        courses_offered: {
          bsonType: "array",
          items: { bsonType: "string" }
        },

         medium: {
          bsonType: "string",
          enum: ["english", "hindi", "other"]
        },

         approx_students_range: {
          bsonType: "string",
          enum: [
            "1-100",
            "101-250",
            "251-500",
            "500-1000",
            "1000+"
          ]
        },
      }
    }
  }
});


db.createCollection("institute_identity_documents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "document_type",
        "document_number",
        "verification_status"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId",
          description: "FK → institutes_master._id"
        },
        document_type: {
          bsonType: "string",
          enum: ["aadhaar", "pan"]
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
        verified_by: { bsonType: "objectId" },
        rejection_reason: { bsonType: "string" },
      }
    }
  }
});

db.institute_identity_documents.createIndex(
  { institute_id: 1, document_type: 1 },
  { unique: true }
);



--In this table we need to store all institute documents like registration certificate
-- affiliation certificate , gst certificate , logo etc
-- In this one propertie 'file_url' we need to store the file link of documents
-- In backend we will store the files(Images(png, jpg, jpeg) , pdf etc) on this table and also on 'uploads' folder on the root level of backend project.
-- we create the unique image name to save - using "institute_name +  document_type + 5 digit random number"
-- we have to create the (model, validation(Joi library), service(don't use class functions), controller(don't use class functions), route) files for this "institute_documents" schema.
-- Make sure while update any document, if image is updating then also replace it from root - 'uploads' with new image and new name.
-- Also Make sure While deleting the any document then also delete the image from 'uploads' folder.
-- We have to create all crud api's for this "institute_documents" schema.

db.createCollection("institute_documents", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "document_type",
        "file_url",
        "verification_status"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId"
        },

        document_type: {
          bsonType: "string",
          enum: [
            "registration_certificate",
            "affiliation_certificate",
            "gst_certificate",
            "logo"
          ]
        },

        file_url: { 
          bsonType: "string"
        },

        verification_status: {
          bsonType: "string",
          enum: ["pending", "approved", "rejected"] --default will be pending
        },

        verified_by: { --if admin verify the document so we need to store admin id
          bsonType: "objectId" 
        },

        rejection_reason: {
          bsonType: "string"
        }
      }
    }
  }
});



-- this table will be changed here wee need to add about all payment transaction and notification
-- expiration and active date for perticular for admin  (subscription)

db.createCollection("institute_subscription_transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "subscription_plan_variant_id",
        "amount",
        "payment_status"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId"
        },

        subscription_plan_variant_id: {
          bsonType: "objectId"
        },

        amount: {
          bsonType: "decimal"
        },

        payment_status: {
          bsonType: "string",
          enum: ["success", "failed", "refunded"]
        },

        payment_gateway: {
          bsonType: "string"
        },

        transaction_id: {
          bsonType: "string"
        },

        receipt_url: {
          bsonType: "string"
        },

        paid_at: {
          bsonType: "date"
        }
      }
    }
  }
});



-- this two properties add on onboarding_basic_information new need to be add 

   /** ARCHIVE FLAGS **/
        is_archived: {
          bsonType: "bool",
          description: "Onboarding completed and locked" 
        },
        archived_at: {
          bsonType: "date",
          description: "When onboarding was completed"
        },




-- Next, we need to create login credentials for the user to access the admin panel.
-- In the admin panel,there are two admin panel for both coaching and school
-- for example admin (user) is subscribe for both panel school and coaching 
-- then the credentials will be the same for both 
-- in case of only one subscription the credentials we have to check weather they are on coaching or school
-- institute admin login credentials associated with institute master table
-- in here we need to check the authentications and all about admin 
-- and also need to check admin his on school or coaching.
-- For this schema we have to create the (model, validation, service, controller, and route) files.
-- We have to Use Nodemailer for mails and otp's.
-- We have to create this all APi for this schemas - (create, update, getAll, getById, delete, verifyLogin, requestOTP, verifyOTP, changePassword)



    db.createCollection("institute_admins", {
    validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "name",
        "email",
        "mobile",
        "password_hash",
        "status",
        "created_at"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId",
          description: "FK → institutes_master._id"
        },

        name: {
          bsonType: "string",
          description: "Institute admin full name"
        },

        email: {
          bsonType: "string"
        }, 

        mobile: {
          bsonType: "string"
        },

        password_hash: {
          bsonType: "string"
        },

        password_key: {
          bsonType: "string",
          description: "One-time key for first login reset"
        },

        is_first_login: {
          bsonType: "bool",
          description: "Force password reset on first login"
        },

        last_login_at: {
          bsonType: "date"
        },

        status: {
          bsonType: "string",
          enum: ["active", "blocked", "disabled"]
        }, 

      }
    }
  }
});

