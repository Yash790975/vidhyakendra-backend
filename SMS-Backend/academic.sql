-- db.subjects_master.insertOne({ 
--   institute_id: ObjectId("66b1a111111111111111111"),
--   subject_name: "Mathematics",
--   subject_code: "MATH-10",
--   subject_type: "school",
--   class_levels: ["10"],
--   stream: "science",
--   description: "Core mathematics subject for class 10",
--   status: "active",
--   created_at: new Date()
-- });   
    

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
          bsonType: "string"
        },

        subject_code: {
          bsonType: ["string", "null"]
        },

        subject_type: {
          bsonType: "string",
          enum: ["school", "coaching"]
        },
        class_levels: {
          bsonType: ["array", "null"],
          items: { bsonType: "string" },
          description: "Example: ['10','11','12']"
        },
        description: {
          bsonType: ["string", "null"]
        },

        status: {
          bsonType: "string",
          enum: ["active", "inactive", "archived"]
        }
     }
    }
  }
});                            
    

-- Class Teacher & Section Logic (Simple Rule)

-- If a class has NO sections     
-- → Assign the class_teacher_id directly in classes_master

-- If a class HAS sections
-- → Keep classes_master.class_teacher_id = null
-- → Assign class_teacher_id inside each section

db.createCollection("classes_master", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "institute_id",
        "class_name",
        "class_type",
        "academic_year",
        "status",
        "created_at"
      ],
      properties: {
        institute_id: {
          bsonType: "objectId"
        },

        class_name: {
          bsonType: "string",
          description: "School: 10th | Coaching: Mathematics"
        },
        class_type: {
          bsonType: "string",
          enum: ["school", "coaching"]
        },
        class_teacher_id: {
          bsonType: ["objectId", "null"],
          description: "FK → teachers_master._id"
        },
        class_level: {
          bsonType: ["string", "null"],
          description: "10, 11, 12 (school only)"
        },
        academic_year: {
          bsonType: "string",
          description: "2025-26"
        },
        status: {
          bsonType: "string",
          enum: ["active", "inactive", "archived"]
        }
        }
        }
  }
});



db.createCollection("class_sections", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "class_id",
        "section_name",
        "status",
        "class_teacher_id",
      ],
      properties: {
        class_id: {
          bsonType: "objectId",
          description: "FK → classes_master._id"
        },

        section_name: {
          bsonType: "string",
          description: "A, B, C"
        },

        class_teacher_id: {
          bsonType: ["objectId", "null"],
          description: "FK → teachers_master._id"
        },

        status: {
          bsonType: "string",
          enum: ["active", "inactive", "archived"]
        },

      }
    }
  }
});

db.class_sections.createIndex(
  { class_id: 1, section_name: 1 },
  { unique: true }
);


db.createCollection("coaching_batches", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "class_id",
        "batch_name",
        "start_time",
        "end_time",
        "status"
      ],
      properties: {
        class_id: {
          bsonType: "objectId",
          description: "FK → classes_master._id (coaching)"
        },

        batch_name: {
          bsonType: "string",
          description: "Morning / Evening Batch"
        },

        start_time: {
          bsonType: "string",
          description: "10:00"
        },

        end_time: {
          bsonType: "string",
          description: "11:00"
        },

        capacity: {
          bsonType: ["int", "null"]
        },

        status: {
          bsonType: "string",
          enum: ["active", "inactive", "archived"]
        }      }
    }
  }
});


db.createCollection("class_subjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "class_id",
        "subject_id",
        "is_compulsory"
      ],
      properties: {
        class_id: {
          bsonType: "objectId",
          description: "FK → classes_master._id"
        },

        subject_id: {
          bsonType: "objectId",
          description: "FK → subjects_master._id"
        },
        is_compulsory: {
          bsonType: "bool"
        },
      created_at: { bsonType: "date" }
      }
    }
  }
});

db.class_subjects.createIndex(
  { class_id: 1, subject_id: 1 },
  { unique: true }
);


db.createCollection("class_subject_schedule", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "class_id",
        "subject_id",
        "start_time",
        "end_time",
        "status"
      ],
      properties: {
        class_id: { 
          bsonType: "objectId",
          description: "FK → classes_master._id"
        },

        section_id: {
          bsonType: ["objectId", "null"],
          description: "FK → class_sections._id (null if no section)"
        },

        subject_id: {
          bsonType: "objectId",
          description: "FK → subjects_master._id"
        },

        teacher_id: {
          bsonType: ["objectId", "null"],
          description: "FK → teachers_master._id"
        },

        day_of_week: {
          bsonType: ["string", "null"],
          enum: ["mon", "tue", "wed", "thu", "fri", "sat"]
        },

        start_time: {
          bsonType: "string",
          description: "08:00"
        },

        end_time: {
          bsonType: "string",
          description: "10:00"
        },

        room_no: {
          bsonType: ["string", "null"]
        },

        status: {
          bsonType: "string",
          enum: ["active", "inactive"]
        }
      }
    }
  }
});

