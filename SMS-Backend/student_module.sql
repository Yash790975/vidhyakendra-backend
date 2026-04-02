-- db.student.find().sort({ createdAt: -1 }).limit(1)
-- This will return last inserted entry



db.createCollection("students_master", {
  validator: { 
    $jsonSchema: {
      bsonType: "object",
      required: [ 
        "institute_id",   
        "student_code", --Generate student code: <INSTITUTE_ACRONYM>-<STUDENT_TYPE>-STD-<RUNNING_NUMBER>
        "student_type",
        "full_name",
        "gender",
        "date_of_birth",
        "status"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId",
          description: "FK → institutes_master._id"
        },

        student_code: {
          bsonType: "string",
          description: "Unique institute-level student code"
        },

        student_type: {
          bsonType: "string",
          enum: ["school", "coaching"]
        },

        full_name: { bsonType: "string" },

        gender: {
          bsonType: "string",
          enum: ["male", "female", "other"]
        },

        date_of_birth: { bsonType: "date" },

        blood_group: { bsonType: ["string", "null"] },

        status: {
          bsonType: "string",
          enum: ["active", "inactive", "blocked", "archived"]
        },

        archived_at: { bsonType: ["date", "null"] }      }
    }
  }
});


db.students_master.createIndex(
  { institute_id: 1, student_code: 1 },
  { unique: true }
);


 
db.createCollection("student_contact_information", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["student_id", "mobile"],
      properties: {

        student_id: { bsonType: "objectId" },

        mobile: { bsonType: "string" },
        email: { bsonType: ["string", "null"] },

        alternate_mobile: { bsonType: ["string", "null"] },

        mobile_verified: { bsonType: "bool" },
        email_verified: { bsonType: "bool" }
      }
    }
  }
});



db.createCollection("student_auth", {
  validator: {
    $jsonSchema: {     
      bsonType: "object", 
      required: [
        "student_id",
        "username",
        "password_hash",
        "status"
      ],
      properties: {

        student_id: { bsonType: "objectId" },

        username: { bsonType: "string" },

        password_hash: { bsonType: "string" },
        password_key: { bsonType: ["string", "null"] },

        is_first_login: { bsonType: "bool" },

        last_login_at: { bsonType: ["date", "null"] },

        status: {
          bsonType: "string",
          enum: ["active", "blocked", "disabled"]
        }
      }
    }
  }
});
      