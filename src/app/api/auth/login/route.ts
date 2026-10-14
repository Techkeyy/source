import { loginUser } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const user = await loginUser({ email: body.email || "", password: body.password || "" });
    return Response.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}
