import { SessionOptions } from "iron-session";
import {Product} from "@/types";

export type SessionData  = {
  cart: Product[];
  userId?: number;
}

export const defaultSession: SessionData  = {
  cart: [],
};

export const sessionOptions: SessionOptions = {
  password: "complex_password_at_least_32_characters_long",
  cookieName:
    "iron-session-grocery-cart",
  cookieOptions: {
    secure: false, // process.env.NODE_ENV === "production"
  },
};
