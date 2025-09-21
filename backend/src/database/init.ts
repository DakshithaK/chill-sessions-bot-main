import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const dbPath = process.env.DATABASE_PATH || './data/conversations.db';

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath);

// Promisify database methods
export const dbRun = promisify(db.run.bind(db));
export const dbGet = promisify(db.get.bind(db));
export const dbAll = promisify(db.all.bind(db));

export interface Message {
  id: string;
  sessionId: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  metadata?: string; // JSON string for additional data
}

export interface Session {
  id: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  metadata?: string; // JSON string for session data
}

export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create sessions table
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          message_count INTEGER DEFAULT 0,
          metadata TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error creating sessions table:', err);
          reject(err);
          return;
        }
      });

      // Create messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          text TEXT NOT NULL,
          sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          metadata TEXT,
          FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Error creating messages table:', err);
          reject(err);
          return;
        }
      });

      // Create indexes for better performance
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_messages_session_id 
        ON messages (session_id)
      `, (err) => {
        if (err) {
          console.error('Error creating session_id index:', err);
          reject(err);
          return;
        }
      });

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_messages_timestamp 
        ON messages (timestamp)
      `, (err) => {
        if (err) {
          console.error('Error creating timestamp index:', err);
          reject(err);
          return;
        }
      });

      // Create trigger to update session updated_at and message_count
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_session_on_message
        AFTER INSERT ON messages
        BEGIN
          UPDATE sessions 
          SET updated_at = CURRENT_TIMESTAMP,
              message_count = message_count + 1
          WHERE id = NEW.session_id;
        END
      `, (err) => {
        if (err) {
          console.error('Error creating trigger:', err);
          reject(err);
          return;
        }
        console.log('✅ Database tables and indexes created successfully');
        resolve();
      });
    });
  });
};

export const createSession = async (): Promise<string> => {
  const sessionId = uuidv4();
  await dbRun(
    'INSERT INTO sessions (id) VALUES (?)',
    [sessionId]
  );
  return sessionId;
};

export const getSession = async (sessionId: string): Promise<Session | null> => {
  const session = await dbGet(
    'SELECT * FROM sessions WHERE id = ?',
    [sessionId]
  ) as Session | undefined;
  return session || null;
};

export const saveMessage = async (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
  const messageId = uuidv4();
  const timestamp = new Date().toISOString();
  
  await dbRun(
    'INSERT INTO messages (id, session_id, text, sender, timestamp, metadata) VALUES (?, ?, ?, ?, ?, ?)',
    [messageId, message.sessionId, message.text, message.sender, timestamp, message.metadata || null]
  );

  return {
    id: messageId,
    sessionId: message.sessionId,
    text: message.text,
    sender: message.sender,
    timestamp,
    metadata: message.metadata,
  };
};

export const getMessages = async (sessionId: string, limit: number = 50, offset: number = 0): Promise<Message[]> => {
  const messages = await dbAll(
    'SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC LIMIT ? OFFSET ?',
    [sessionId, limit, offset]
  ) as Message[];
  return messages;
};

export const getRecentSessions = async (limit: number = 10): Promise<Session[]> => {
  const sessions = await dbAll(
    'SELECT * FROM sessions ORDER BY updated_at DESC LIMIT ?',
    [limit]
  ) as Session[];
  return sessions;
};
