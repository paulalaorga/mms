import crypto from "crypto";

const SALT = process.env.PASSWORD_SALT || "default_salt"; // Usa una variable de entorno para seguridad

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, SALT, 10000, 64, "sha256").toString("hex");
}

export function comparePassword(inputPassword: string, hashedPassword: string): boolean {
  return hashPassword(inputPassword) === hashedPassword;
}
