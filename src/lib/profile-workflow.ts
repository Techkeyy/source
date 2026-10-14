import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { analyzeWithGemma } from "./gemma";
import type { ExtractedWebsite } from "./extract";
import type { ProfileDraft } from "./types";

const inputSchema = z.object({ requestedUrl: z.string(), finalUrl: z.string(), title: z.string(), description: z.string(), text: z.string(), excerpts: z.array(z.string()) });
const outputSchema = z.object({ draft: z.custom<ProfileDraft>(), latencyMs: z.number(), model: z.string(), provider: z.string() });

const gemmaStep = createStep({
  id: "grounded-gemma-profile",
  inputSchema,
  outputSchema,
  execute: async ({ inputData }) => analyzeWithGemma(inputData as ExtractedWebsite),
});

export const profileAnalysisWorkflow = createWorkflow({ id: "source-profile-analysis", inputSchema, outputSchema }).then(gemmaStep).commit();

export async function runProfileAnalysis(site: ExtractedWebsite) {
  const run = await profileAnalysisWorkflow.createRun();
  const result = await run.start({ inputData: site });
  if (result.status !== "success") throw new Error("The profile analysis workflow did not complete.");
  return result.result;
}
