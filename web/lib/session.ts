import { SessionOptions } from "iron-session";
import type { Product } from "@/types";


/**
 * Defines the structure of session data stored using iron-session.
 */
export type SessionData = {
  /** The user's shopping cart, containing an array of products. */
  cart: Product[];

  /** The optional user ID if the user is logged in. */
  userId?: number;
};

/**
 * Default session data, used when a session is first created.
 */
export const defaultSession: SessionData = {
  cart: [],
};

/**
 * Configuration options for the iron-session middleware.
 *
 * @property password - The secret key used to encrypt the session.
 * @property cookieName - The name of the session cookie.
 * @property cookieOptions - Options for cookie behavior.
 *   - secure: If `true`, the cookie is only set over HTTPS (currently set to false, but should be enabled in a "real" production env).
 */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "iron-session-grocery-cart",
  cookieOptions: {
    secure: false, // process.env.NODE_ENV === "production"
  },
};
