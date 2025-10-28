// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  // 정적파일/자산 제외하고 모든 경로 보호
  matcher: ["/((?!_next|assets|.*\\..*).*)"],
};

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const user = process.env.BASIC_AUTH_USER || "";
  const pass = process.env.BASIC_AUTH_PASS || "";

  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  if (auth === expected) return NextResponse.next();

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="TwinWallet"' },
  });
}
