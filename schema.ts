import { pgTable, text, serial, integer, boolean, timestamp, date, time, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users/Staff schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // admin, doctor, nurse, receptionist
  department: text("department"),
  specialty: text("specialty"),
  contact: text("contact"),
  email: text("email"),
  status: text("status").default("active"), // active, on leave, inactive
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Patients schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(), // Custom patient ID format
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  contact: text("contact"),
  email: text("email"),
  address: text("address"),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactNumber: text("emergency_contact_number"),
  status: text("status").default("active"), // active, discharged, critical, stable
  admissionDate: date("admission_date"),
  dischargeDate: date("discharge_date"),
  roomNumber: text("room_number"),
  assignedDoctorId: integer("assigned_doctor_id"),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
});

// Appointments schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  duration: integer("duration").default(30), // in minutes
  status: text("status").default("scheduled"), // scheduled, completed, cancelled, waiting, in progress
  department: text("department").notNull(),
  notes: text("notes"),
  reasonForVisit: text("reason_for_visit"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

// Inventory/Medication schema
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(), // medication, equipment, supplies
  quantity: integer("quantity").default(0),
  unit: text("unit"), // tablets, bottles, pieces, etc.
  reorderLevel: integer("reorder_level"),
  cost: integer("cost"), // in cents
  supplier: text("supplier"),
  location: text("location"),
  expiryDate: date("expiry_date"),
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
});

// Departments schema
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  capacity: integer("capacity").notNull(),
  currentLoad: integer("current_load").default(0),
  numDoctors: integer("num_doctors").default(0),
  numNurses: integer("num_nurses").default(0),
  status: text("status").default("normal"), // normal, high load, moderate, critical
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

// Notifications schema
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // alert, info, warning, success
  timestamp: timestamp("timestamp").defaultNow(),
  isRead: boolean("is_read").default(false),
  userId: integer("user_id"), // can be null for system-wide notifications
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
  isRead: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
