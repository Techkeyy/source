import { currentUser } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";

export async function GET() {
  try {
    return Response.json({ user: await currentUser() });
  } catch (error) {
    return errorResponse(error);
  }
}
