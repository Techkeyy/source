import { registerUser } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; displayName?: string; password?: string };
    const user = await registerUser({ email: body.email || "", displayName: body.displayName || "", password: body.password || "" });
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
