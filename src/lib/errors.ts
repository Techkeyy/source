export class SourceError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 400, code = "SOURCE_ERROR") {
    super(message);
    this.name = "SourceError";
    this.status = status;
    this.code = code;
  }
}

export class ConfigurationError extends SourceError {
  constructor(message: string) {
    super(message, 503, "CONFIGURATION_REQUIRED");
  }
}

export class UnauthorizedError extends SourceError {
  constructor(message = "Sign in to continue.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof SourceError) {
    return Response.json({ error: error.message, code: error.code }, { status: error.status });
  }

  console.error("Unexpected Source error", error);
  return Response.json(
    { error: "Something went wrong. Your data was not changed.", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}
