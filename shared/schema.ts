import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ['admin', 'leadership', 'member'] }).default('member'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Members table for BJP members
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  fullName: varchar("full_name").notNull(),
  phone: varchar("phone"),
  constituency: varchar("constituency").notNull(),
  district: varchar("district").notNull(),
  division: varchar("division").notNull(),
  designation: varchar("designation"),
  achievements: text("achievements"),
  socialMediaHandles: jsonb("social_media_handles"),
  isVerified: boolean("is_verified").default(false),
  membershipDate: date("membership_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  eventType: varchar("event_type", { enum: ['online', 'offline', 'hybrid'] }).notNull(),
  venue: varchar("venue"),
  eventDate: timestamp("event_date").notNull(),
  endDate: timestamp("end_date"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  meetingLink: varchar("meeting_link"),
  organizer: varchar("organizer").references(() => users.id),
  constituency: varchar("constituency"),
  district: varchar("district"),
  status: varchar("status", { enum: ['draft', 'published', 'cancelled', 'completed'] }).default('draft'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Event attendees
export const eventAttendees = pgTable("event_attendees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id),
  memberId: varchar("member_id").references(() => members.id),
  status: varchar("status", { enum: ['invited', 'confirmed', 'attended', 'absent'] }).default('invited'),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Notices table
export const notices = pgTable("notices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  priority: varchar("priority", { enum: ['urgent', 'high', 'medium', 'low'] }).default('medium'),
  category: varchar("category").notNull(),
  author: varchar("author").references(() => users.id),
  targetAudience: varchar("target_audience", { enum: ['all', 'leadership', 'constituency'] }).default('all'),
  constituency: varchar("constituency"),
  district: varchar("district"),
  expiryDate: timestamp("expiry_date"),
  attachments: jsonb("attachments"),
  isPinned: boolean("is_pinned").default(false),
  viewCount: integer("view_count").default(0),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feedback table
export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").references(() => members.id),
  memberName: varchar("member_name").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  category: varchar("category", { enum: ['suggestion', 'complaint', 'appreciation', 'meeting_request', 'event_feedback', 'technical_issue'] }).notNull(),
  status: varchar("status", { enum: ['pending', 'in_progress', 'resolved'] }).default('pending'),
  priority: varchar("priority", { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  userType: varchar("user_type", { enum: ['member', 'leader'] }).default('member'),
  phone: varchar("phone"),
  email: varchar("email"),
  constituency: varchar("constituency"),
  district: varchar("district"),
  eventId: varchar("event_id").references(() => events.id),
  attachmentUrls: jsonb("attachment_urls"),
  response: text("response"),
  responseDate: timestamp("response_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leadership profiles
export const leadership = pgTable("leadership", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  designation: varchar("designation").notNull(),
  bio: text("bio"),
  profileImage: varchar("profile_image"),
  contactEmail: varchar("contact_email"),
  socialMedia: jsonb("social_media"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  members: many(members),
  events: many(events),
  notices: many(notices),
  leadership: many(leadership),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  eventAttendees: many(eventAttendees),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizer],
    references: [users.id],
  }),
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  member: one(members, {
    fields: [eventAttendees.memberId],
    references: [members.id],
  }),
}));

export const noticesRelations = relations(notices, ({ one }) => ({
  author: one(users, {
    fields: [notices.author],
    references: [users.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  member: one(members, {
    fields: [feedback.memberId],
    references: [members.id],
  }),
  event: one(events, {
    fields: [feedback.eventId],
    references: [events.id],
  }),
}));

export const leadershipRelations = relations(leadership, ({ one }) => ({
  user: one(users, {
    fields: [leadership.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoticeSchema = createInsertSchema(notices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadershipSchema = createInsertSchema(leadership).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventAttendee = typeof eventAttendees.$inferSelect;
export type Notice = typeof notices.$inferSelect;
export type Leadership = typeof leadership.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type InsertLeadership = z.infer<typeof insertLeadershipSchema>;
