import {
  users,
  members,
  events,
  notices,
  feedback,
  leadership,
  eventAttendees,
  type User,
  type UpsertUser,
  type Member,
  type Event,
  type Notice,
  type Feedback,
  type Leadership,
  type InsertMember,
  type InsertEvent,
  type InsertNotice,
  type InsertFeedback,
  type InsertLeadership,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, like, and, or, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Member operations
  getMembers(params?: { 
    search?: string; 
    constituency?: string; 
    district?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<{ members: Member[]; total: number }>;
  getMember(id: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: string, member: Partial<InsertMember>): Promise<Member>;
  deleteMember(id: string): Promise<void>;
  getMemberStats(): Promise<{
    total: number;
    byDivision: { division: string; count: number }[];
    recentMembers: Member[];
  }>;
  
  // Event operations
  getEvents(params?: {
    search?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ events: Event[]; total: number }>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  
  // Notice operations
  getNotices(params?: {
    search?: string;
    priority?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ notices: Notice[]; total: number }>;
  getNotice(id: string): Promise<Notice | undefined>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  updateNotice(id: string, notice: Partial<InsertNotice>): Promise<Notice>;
  deleteNotice(id: string): Promise<void>;
  getRecentNotices(limit?: number): Promise<Notice[]>;
  
  // Feedback operations
  getFeedback(params?: {
    search?: string;
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ feedback: Feedback[]; total: number }>;
  getFeedbackItem(id: string): Promise<Feedback | undefined>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: string, feedback: Partial<InsertFeedback>): Promise<Feedback>;
  deleteFeedback(id: string): Promise<void>;
  getRecentFeedback(limit?: number): Promise<Feedback[]>;
  
  // Leadership operations
  getLeadership(): Promise<Leadership[]>;
  getLeadershipMember(id: string): Promise<Leadership | undefined>;
  createLeadershipMember(leader: InsertLeadership): Promise<Leadership>;
  updateLeadershipMember(id: string, leader: Partial<InsertLeadership>): Promise<Leadership>;
  deleteLeadershipMember(id: string): Promise<void>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalMembers: number;
    activeEvents: number;
    totalConstituencies: number;
    newNotices: number;
    memberGrowth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getMembers(params: {
    search?: string;
    constituency?: string;
    district?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ members: Member[]; total: number }> {
    const { search, constituency, district, limit = 20, offset = 0 } = params;
    
    let query = db.select().from(members);
    let countQuery = db.select({ count: count() }).from(members);
    
    const conditions = [];
    
    if (search) {
      conditions.push(like(members.fullName, `%${search}%`));
    }
    
    if (constituency) {
      conditions.push(eq(members.constituency, constituency));
    }
    
    if (district) {
      conditions.push(eq(members.district, district));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    const [membersResult, totalResult] = await Promise.all([
      query.orderBy(desc(members.createdAt)).limit(limit).offset(offset),
      countQuery
    ]);
    
    return {
      members: membersResult,
      total: totalResult[0].count
    };
  }

  async getMember(id: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values(member).returning();
    return newMember;
  }

  async updateMember(id: string, member: Partial<InsertMember>): Promise<Member> {
    const [updatedMember] = await db
      .update(members)
      .set({ ...member, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
    return updatedMember;
  }

  async deleteMember(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  async getMemberStats(): Promise<{
    total: number;
    byDivision: { division: string; count: number }[];
    recentMembers: Member[];
  }> {
    const [totalResult, divisionStats, recentMembers] = await Promise.all([
      db.select({ count: count() }).from(members),
      db
        .select({
          division: members.division,
          count: count()
        })
        .from(members)
        .groupBy(members.division),
      db
        .select()
        .from(members)
        .orderBy(desc(members.createdAt))
        .limit(5)
    ]);

    return {
      total: totalResult[0].count,
      byDivision: divisionStats,
      recentMembers
    };
  }

  async getEvents(params: {
    search?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ events: Event[]; total: number }> {
    const { search, status, startDate, endDate, limit = 20, offset = 0 } = params;
    
    let query = db.select().from(events);
    let countQuery = db.select({ count: count() }).from(events);
    
    const conditions = [];
    
    if (search) {
      conditions.push(like(events.title, `%${search}%`));
    }
    
    if (status) {
      conditions.push(eq(events.status, status));
    }
    
    if (startDate) {
      conditions.push(gte(events.eventDate, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(events.eventDate, endDate));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    const [eventsResult, totalResult] = await Promise.all([
      query.orderBy(desc(events.eventDate)).limit(limit).offset(offset),
      countQuery
    ]);
    
    return {
      events: eventsResult,
      total: totalResult[0].count
    };
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(and(
        eq(events.status, 'published'),
        gte(events.eventDate, new Date())
      ))
      .orderBy(events.eventDate)
      .limit(limit);
  }

  async getNotices(params: {
    search?: string;
    priority?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ notices: Notice[]; total: number }> {
    const { search, priority, category, limit = 20, offset = 0 } = params;
    
    let query = db.select().from(notices);
    let countQuery = db.select({ count: count() }).from(notices);
    
    const conditions = [];
    
    if (search) {
      conditions.push(or(
        like(notices.title, `%${search}%`),
        like(notices.content, `%${search}%`)
      ));
    }
    
    if (priority) {
      conditions.push(eq(notices.priority, priority));
    }
    
    if (category) {
      conditions.push(eq(notices.category, category));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    const [noticesResult, totalResult] = await Promise.all([
      query.orderBy(desc(notices.isPinned), desc(notices.publishedAt)).limit(limit).offset(offset),
      countQuery
    ]);
    
    return {
      notices: noticesResult,
      total: totalResult[0].count
    };
  }

  async getNotice(id: string): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice;
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [newNotice] = await db.insert(notices).values(notice).returning();
    return newNotice;
  }

  async updateNotice(id: string, notice: Partial<InsertNotice>): Promise<Notice> {
    const [updatedNotice] = await db
      .update(notices)
      .set({ ...notice, updatedAt: new Date() })
      .where(eq(notices.id, id))
      .returning();
    return updatedNotice;
  }

  async deleteNotice(id: string): Promise<void> {
    await db.delete(notices).where(eq(notices.id, id));
  }

  async getRecentNotices(limit: number = 5): Promise<Notice[]> {
    return await db
      .select()
      .from(notices)
      .orderBy(desc(notices.isPinned), desc(notices.publishedAt))
      .limit(limit);
  }

  async getFeedback(params: {
    search?: string;
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ feedback: Feedback[]; total: number }> {
    const { search, status, category, limit = 20, offset = 0 } = params;
    
    let query = db.select().from(feedback);
    let countQuery = db.select({ count: count() }).from(feedback);
    
    const conditions = [];
    
    if (search) {
      conditions.push(or(
        like(feedback.subject, `%${search}%`),
        like(feedback.message, `%${search}%`),
        like(feedback.memberName, `%${search}%`)
      ));
    }
    
    if (status) {
      conditions.push(eq(feedback.status, status));
    }
    
    if (category) {
      conditions.push(eq(feedback.category, category));
    }
    
    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    const [feedbackResult, totalResult] = await Promise.all([
      query.orderBy(desc(feedback.createdAt)).limit(limit).offset(offset),
      countQuery
    ]);
    
    return {
      feedback: feedbackResult,
      total: totalResult[0].count
    };
  }

  async getFeedbackItem(id: string): Promise<Feedback | undefined> {
    const [feedbackItem] = await db.select().from(feedback).where(eq(feedback.id, id));
    return feedbackItem;
  }

  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values(feedbackData).returning();
    return newFeedback;
  }

  async updateFeedback(id: string, feedbackData: Partial<InsertFeedback>): Promise<Feedback> {
    const [updatedFeedback] = await db
      .update(feedback)
      .set({ ...feedbackData, updatedAt: new Date() })
      .where(eq(feedback.id, id))
      .returning();
    return updatedFeedback;
  }

  async deleteFeedback(id: string): Promise<void> {
    await db.delete(feedback).where(eq(feedback.id, id));
  }

  async getRecentFeedback(limit: number = 5): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .orderBy(desc(feedback.createdAt))
      .limit(limit);
  }

  async getLeadership(): Promise<Leadership[]> {
    return await db
      .select()
      .from(leadership)
      .where(eq(leadership.isActive, true))
      .orderBy(leadership.displayOrder);
  }

  async getLeadershipMember(id: string): Promise<Leadership | undefined> {
    const [leader] = await db.select().from(leadership).where(eq(leadership.id, id));
    return leader;
  }

  async createLeadershipMember(leader: InsertLeadership): Promise<Leadership> {
    const [newLeader] = await db.insert(leadership).values(leader).returning();
    return newLeader;
  }

  async updateLeadershipMember(id: string, leader: Partial<InsertLeadership>): Promise<Leadership> {
    const [updatedLeader] = await db
      .update(leadership)
      .set({ ...leader, updatedAt: new Date() })
      .where(eq(leadership.id, id))
      .returning();
    return updatedLeader;
  }

  async deleteLeadershipMember(id: string): Promise<void> {
    await db.delete(leadership).where(eq(leadership.id, id));
  }

  async getDashboardStats(): Promise<{
    totalMembers: number;
    activeEvents: number;
    totalConstituencies: number;
    newNotices: number;
    memberGrowth: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [
      totalMembersResult,
      activeEventsResult,
      totalConstituenciesResult,
      newNoticesResult,
      recentMembersResult,
      oldMembersResult
    ] = await Promise.all([
      db.select({ count: count() }).from(members),
      db.select({ count: count() }).from(events).where(eq(events.status, 'published')),
      db.select({ count: count(sql`DISTINCT ${members.constituency}`) }).from(members),
      db.select({ count: count() }).from(notices).where(gte(notices.publishedAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(members).where(gte(members.createdAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(members).where(lte(members.createdAt, thirtyDaysAgo))
    ]);

    const totalMembers = totalMembersResult[0].count;
    const recentMembers = recentMembersResult[0].count;
    const oldMembers = oldMembersResult[0].count;
    const memberGrowth = oldMembers > 0 ? Math.round((recentMembers / oldMembers) * 100) : 100;

    return {
      totalMembers,
      activeEvents: activeEventsResult[0].count,
      totalConstituencies: totalConstituenciesResult[0].count,
      newNotices: newNoticesResult[0].count,
      memberGrowth
    };
  }
}

export const storage = new DatabaseStorage();
