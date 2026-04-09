import { SignJWT, jwtVerify, type JWTPayload } from "jose";

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || "hilo-y-miel-jwt-secret-CHANGE-IN-PRODUCTION";
  return new TextEncoder().encode(secret);
}

export interface CustomerJWTPayload extends JWTPayload {
  customerId: string;
  email: string;
  role: "customer";
}

export interface AdminJWTPayload extends JWTPayload {
  email: string;
  role: "admin";
}

export type TokenPayload = CustomerJWTPayload | AdminJWTPayload;

/** Genera un JWT para cliente con expiración de 1 hora */
export async function signCustomerToken(payload: {
  customerId: string;
  email: string;
}): Promise<string> {
  return new SignJWT({ ...payload, role: "customer" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecret());
}

/** Genera un JWT para admin con expiración de 24 horas */
export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

/** Verifica y decodifica un JWT. Retorna null si expiró o es inválido. */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/** Verifica que el token sea de un admin */
export async function verifyAdminToken(token: string): Promise<boolean> {
  const payload = await verifyToken(token);
  return payload?.role === "admin";
}

/** Verifica que el token sea de un cliente. Retorna el payload o null. */
export async function verifyCustomerToken(
  token: string
): Promise<CustomerJWTPayload | null> {
  const payload = await verifyToken(token);
  if (payload?.role === "customer") return payload as CustomerJWTPayload;
  return null;
}
