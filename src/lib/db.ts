import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { Order, User } from './types';

// Tiny JSON-file store. Good enough for a single-process demo; swap for a real DB before scaling out.
type Data = { users: User[]; orders: Order[] };

const FILE = path.join(process.cwd(), 'data', 'db.json');

function read(): Data {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as Data;
  } catch {
    return { users: [], orders: [] };
  }
}

function write(data: Data) {
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, FILE);
}

export function findUserByEmail(email: string) {
  return read().users.find(u => u.email === email.toLowerCase()) ?? null;
}

export function findUserById(id: string) {
  return read().users.find(u => u.id === id) ?? null;
}

export function createUser(user: User) {
  const data = read();
  data.users.push(user);
  write(data);
}

export function createOrder(order: Order) {
  const data = read();
  data.orders.push(order);
  write(data);
}

export function ordersFor(userId: string) {
  return read().orders.filter(o => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(userId: string, id: string) {
  return read().orders.find(o => o.userId === userId && o.id === id) ?? null;
}
