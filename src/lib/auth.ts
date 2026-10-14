import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { collection, ensureIndexes } from "./db";
import { ConfigurationError, SourceError, UnauthorizedError } from "./errors";
import { requiredEnv } from "./env";
import type { PublicUser } from "./types";

const SESSION_COOKIE = "source_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

interface UserDocument {
  _id: ObjectId;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: Date;
}

function sessionKey() {
  const secret = requiredEnv("SESSION_SECRET");
  if (secret.length < 32) throw new ConfigurationError("SESSION_SECRET must be at least 32 characters.");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: ObjectId) {
  const token = await new SignJWT({ sub: userId.toHexString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(sessionKey());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession() {
  (await cookies()).set(SESSION_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function getSessionUserId(): Promise<ObjectId | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionKey());
    if (typeof payload.sub !== "string" || !ObjectId.isValid(payload.sub)) return null;
    return new ObjectId(payload.sub);
  } catch {
    return null;
  }
}

export async function requireUserId() {
  const userId = await getSessionUserId();
  if (!userId) throw new UnauthorizedError();
  return userId;
}

export function publicUser(user: UserDocument): PublicUser {
  return { id: user._id.toHexString(), email: user.email, displayName: user.displayName };
}

export async function registerUser(input: { email: string; displayName: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new SourceError("Enter a valid email address.");
  if (input.displayName.trim().length < 2 || input.displayName.trim().length > 80) throw new SourceError("Enter a name between 2 and 80 characters.");
  if (input.password.length < 12) throw new SourceError("Use a password with at least 12 characters.");
  await ensureIndexes();
  const users = await collection<UserDocument>("users");
  const existing = await users.findOne({ email });
  if (existing) throw new SourceError("An account with this email already exists.", 409, "EMAIL_EXISTS");
  const user: UserDocument = {
    _id: new ObjectId(),
    email,
    displayName: input.displayName.trim(),
    passwordHash: await hashPassword(input.password),
    createdAt: new Date(),
  };
  await users.insertOne(user);
  await createSession(user._id);
  return publicUser(user);
}

export async function loginUser(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const users = await collection<UserDocument>("users");
  const user = await users.findOne({ email });
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) throw new UnauthorizedError("Email or password is incorrect.");
  await createSession(user._id);
  return publicUser(user);
}

export async function currentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await (await collection<UserDocument>("users")).findOne({ _id: userId });
  return user ? publicUser(user) : null;
}
