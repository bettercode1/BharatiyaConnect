import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertMemberSchema,
  insertEventSchema,
  insertNoticeSchema,
  insertLeadershipSchema,
  insertFeedbackSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/member-stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getMemberStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching member stats:", error);
      res.status(500).json({ message: "Failed to fetch member stats" });
    }
  });

  app.get('/api/dashboard/upcoming-events', isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents(5);
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.get('/api/dashboard/recent-notices', isAuthenticated, async (req, res) => {
    try {
      const notices = await storage.getRecentNotices(5);
      res.json(notices);
    } catch (error) {
      console.error("Error fetching recent notices:", error);
      res.status(500).json({ message: "Failed to fetch recent notices" });
    }
  });

  // Member routes
  app.get('/api/members', isAuthenticated, async (req, res) => {
    try {
      const { search, constituency, district, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const result = await storage.getMembers({
        search: search as string,
        constituency: constituency as string,
        district: district as string,
        limit: parseInt(limit as string),
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.get('/api/members/:id', isAuthenticated, async (req, res) => {
    try {
      const member = await storage.getMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });

  app.post('/api/members', isAuthenticated, async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      console.error("Error creating member:", error);
      res.status(500).json({ message: "Failed to create member" });
    }
  });

  app.put('/api/members/:id', isAuthenticated, async (req, res) => {
    try {
      const memberData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(req.params.id, memberData);
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid member data", errors: error.errors });
      }
      console.error("Error updating member:", error);
      res.status(500).json({ message: "Failed to update member" });
    }
  });

  app.delete('/api/members/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Event routes
  app.get('/api/events', isAuthenticated, async (req, res) => {
    try {
      const { search, status, startDate, endDate, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const result = await storage.getEvents({
        search: search as string,
        status: status as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: parseInt(limit as string),
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/:id', isAuthenticated, async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const eventData = insertEventSchema.parse({
        ...req.body,
        organizer: req.user.claims.sub
      });
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put('/api/events/:id', isAuthenticated, async (req, res) => {
    try {
      const eventData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, eventData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete('/api/events/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Notice routes
  app.get('/api/notices', isAuthenticated, async (req, res) => {
    try {
      const { search, priority, category, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const result = await storage.getNotices({
        search: search as string,
        priority: priority as string,
        category: category as string,
        limit: parseInt(limit as string),
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching notices:", error);
      res.status(500).json({ message: "Failed to fetch notices" });
    }
  });

  app.get('/api/notices/:id', isAuthenticated, async (req, res) => {
    try {
      const notice = await storage.getNotice(req.params.id);
      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }
      res.json(notice);
    } catch (error) {
      console.error("Error fetching notice:", error);
      res.status(500).json({ message: "Failed to fetch notice" });
    }
  });

  app.post('/api/notices', isAuthenticated, async (req: any, res) => {
    try {
      const noticeData = insertNoticeSchema.parse({
        ...req.body,
        author: req.user.claims.sub
      });
      const notice = await storage.createNotice(noticeData);
      res.status(201).json(notice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notice data", errors: error.errors });
      }
      console.error("Error creating notice:", error);
      res.status(500).json({ message: "Failed to create notice" });
    }
  });

  app.put('/api/notices/:id', isAuthenticated, async (req, res) => {
    try {
      const noticeData = insertNoticeSchema.partial().parse(req.body);
      const notice = await storage.updateNotice(req.params.id, noticeData);
      res.json(notice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notice data", errors: error.errors });
      }
      console.error("Error updating notice:", error);
      res.status(500).json({ message: "Failed to update notice" });
    }
  });

  app.delete('/api/notices/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteNotice(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting notice:", error);
      res.status(500).json({ message: "Failed to delete notice" });
    }
  });

  // Feedback routes
  app.get('/api/feedback', isAuthenticated, async (req, res) => {
    try {
      const { search, status, category, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const result = await storage.getFeedback({
        search: search as string,
        status: status as string,
        category: category as string,
        limit: parseInt(limit as string),
        offset
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.get('/api/feedback/:id', isAuthenticated, async (req, res) => {
    try {
      const feedback = await storage.getFeedbackItem(req.params.id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post('/api/feedback', isAuthenticated, async (req: any, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        memberId: req.user.claims.sub
      });
      const feedback = await storage.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      }
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  app.put('/api/feedback/:id', isAuthenticated, async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.partial().parse(req.body);
      const feedback = await storage.updateFeedback(req.params.id, feedbackData);
      res.json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      }
      console.error("Error updating feedback:", error);
      res.status(500).json({ message: "Failed to update feedback" });
    }
  });

  app.delete('/api/feedback/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteFeedback(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ message: "Failed to delete feedback" });
    }
  });

  // Leadership routes
  app.get('/api/leadership', async (req, res) => {
    try {
      const leadership = await storage.getLeadership();
      res.json(leadership);
    } catch (error) {
      console.error("Error fetching leadership:", error);
      res.status(500).json({ message: "Failed to fetch leadership" });
    }
  });

  app.get('/api/leadership/:id', isAuthenticated, async (req, res) => {
    try {
      const leader = await storage.getLeadershipMember(req.params.id);
      if (!leader) {
        return res.status(404).json({ message: "Leadership member not found" });
      }
      res.json(leader);
    } catch (error) {
      console.error("Error fetching leadership member:", error);
      res.status(500).json({ message: "Failed to fetch leadership member" });
    }
  });

  app.post('/api/leadership', isAuthenticated, async (req, res) => {
    try {
      const leaderData = insertLeadershipSchema.parse(req.body);
      const leader = await storage.createLeadershipMember(leaderData);
      res.status(201).json(leader);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid leadership data", errors: error.errors });
      }
      console.error("Error creating leadership member:", error);
      res.status(500).json({ message: "Failed to create leadership member" });
    }
  });

  app.put('/api/leadership/:id', isAuthenticated, async (req, res) => {
    try {
      const leaderData = insertLeadershipSchema.partial().parse(req.body);
      const leader = await storage.updateLeadershipMember(req.params.id, leaderData);
      res.json(leader);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid leadership data", errors: error.errors });
      }
      console.error("Error updating leadership member:", error);
      res.status(500).json({ message: "Failed to update leadership member" });
    }
  });

  app.delete('/api/leadership/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteLeadershipMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting leadership member:", error);
      res.status(500).json({ message: "Failed to delete leadership member" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
