import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { Redis } from '@upstash/redis';
import type { Order, User } from './types';

/*
 * Storage for users and orders.
 *
 * - Deployed (Vercel): Upstash Redis, added from the Vercel project's Storage tab. The integration
 *   injects KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN).
 * - Local dev: a JSON file at data/db.json, so `npm run dev` needs no setup.
 *
 * Vercel's filesystem is read-only, so the file store cannot work there; if Redis isn't
 * configured on Vercel we fail loudly with StorageNotConfiguredError instead of silently.
 */

export class StorageNotConfiguredError extends Error {
  constructor() {
    super('Account storage is not configured. Add an Upstash Redis store in the Vercel project (Storage tab) and redeploy.');
  }
}

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// ---------- Redis layout ----------
// user:<id>            -> User
// user-email:<email>   -> user id (set with NX, so two sign-ups can't claim one email)
// order:<id>           -> Order
// user-orders:<userId> -> list of order ids, newest first
const k = {
  user: (id: string) => `shopora:user:${id}`,
  email: (email: string) => `shopora:user-email:${email.toLowerCase()}`,
  order: (id: string) => `shopora:order:${id}`,
  userOrders: (userId: string) => `shopora:user-orders:${userId}`,
};

// ---------- file fallback (local dev only) ----------
type Data = { users: User[]; orders: Order[] };
const FILE = path.join(process.cwd(), 'data', 'db.json');

function readFile(): Data {
  if (process.env.VERCEL) throw new StorageNotConfiguredError();
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as Data;
  } catch {
    return { users: [], orders: [] };
  }
}

function writeFile(data: Data) {
  if (process.env.VERCEL) throw new StorageNotConfiguredError();
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, FILE);
}

// ---------- public API ----------
export async function findUserByEmail(email: string): Promise<User | null> {
  if (redis) {
    const id = await redis.get<string>(k.email(email));
    return id ? findUserById(id) : null;
  }
  return readFile().users.find(u => u.email === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  if (redis) return (await redis.get<User>(k.user(id))) ?? null;
  return readFile().users.find(u => u.id === id) ?? null;
}

/** Returns false if the email is already taken. */
export async function createUser(user: User): Promise<boolean> {
  if (redis) {
    const claimed = await redis.set(k.email(user.email), user.id, { nx: true });
    if (claimed !== 'OK') return false;
    await redis.set(k.user(user.id), user);
    return true;
  }
  const data = readFile();
  if (data.users.some(u => u.email === user.email)) return false;
  data.users.push(user);
  writeFile(data);
  return true;
}

export async function createOrder(order: Order): Promise<void> {
  if (redis) {
    await redis.set(k.order(order.id), order);
    await redis.lpush(k.userOrders(order.userId), order.id);
    return;
  }
  const data = readFile();
  data.orders.push(order);
  writeFile(data);
}

export async function ordersFor(userId: string): Promise<Order[]> {
  if (redis) {
    const ids = await redis.lrange<string>(k.userOrders(userId), 0, -1);
    if (!ids.length) return [];
    const orders = await redis.mget<(Order | null)[]>(...ids.map(k.order));
    return orders.filter((o): o is Order => o !== null);
  }
  return readFile()
    .orders.filter(o => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(userId: string, id: string): Promise<Order | null> {
  if (redis) {
    const o = await redis.get<Order>(k.order(id));
    return o && o.userId === userId ? o : null;
  }
  return readFile().orders.find(o => o.userId === userId && o.id === id) ?? null;
}
