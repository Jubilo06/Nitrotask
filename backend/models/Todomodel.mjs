import mongoose from "mongoose";

const meetingMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
      required: function () {
        return !this.phoneNumber;
      }, // Either email or phone is required
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please fill a valid phone number (E.164 format)",
      ], // E.164 format
      required: function () {
        return !this.email;
      }, // Either email or phone is required
    },
    notificationMethod: {
      // How to notify this specific member
      type: String,
      enum: ["email", "sms", "call"], // Added 'call' for phone reminders
      default: "email",
    },
  },
  { _id: false }
);
const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  description: {
    // Added for more detail
    type: String,
    trim: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  category: {
    // e.g., "Work", "Personal", "Shopping"
    type: String,
    trim: true,
    default: "General",
  },
  dueDate: {
    type: Date, // For due dates and reminders
    default: null,
  },
  priority: {
    // e.g., 0 (Low), 1 (Medium), 2 (High)
    type: Number,
    min: 0,
    max: 2,
    default: 0,
  },
  user: {
    // Reference to the User who owns this todo
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isMeeting: {
    // NEW: Flag to identify if this todo is a meeting
    type: Boolean,
    default: false,
  },
  meetingMembers: [meetingMemberSchema], // NEW: Array of members for a meeting todo
  reminderSent: {
    // NEW: To track if initial reminders have been sent
    type: Boolean,
    default: false,
  },
  lastReminderSentAt: {
    type: Date,
    default: null, // Will be updated when a reminder is sent
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` field automatically on save
todoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Todo", todoSchema);