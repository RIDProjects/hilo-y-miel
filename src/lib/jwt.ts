import { SignJWT, jwtVerify, type JWTPayload } from "jose";

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || "hilo-y-miel-jwt-secret-CHANGE-IN-PRODUCTION";
  return new TextEncoder().encode(secret);
}

export interface CustomerJWTPayload extends JWTPayload {
  customerId: string;
  email: string;
  role: "customer" | "admin";
}

export type TokenPayload = CustomerJWTPayload;

/** Genera un JWT para cualquier usuario (customer o admin) */
export async function signCustomerToken(payload: {
  customerId: string;
  email: string;
  role: "customer" | "admin";
}): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

/** Verifica y decodifica un JWT. Retorna null si expiró o es inválido. */
export async function verifyToken(token: string): Promise<CustomerJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as CustomerJWTPayload;
  } catch {
    return null;
  }
}

/** Verifica que el token sea de un admin */
export async function verifyAdminToken(token: string): Promise<boolean> {
  const payload = await verifyToken(token);
  return payload?.role === "admin";
}

/** Verifica que el token sea de un cliente o admin. Retorna el payload o null. */
export async function verifyCustomerToken(
  token: string
): Promise<CustomerJWTPayload | null> {
  return verifyToken(token);
}

/** @deprecated — usar signCustomerToken con role: "admin" */
export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}
