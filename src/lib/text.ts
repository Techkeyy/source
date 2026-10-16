const MOJIBAKE_CLUSTER = /(?:Ã[\u0080-\u00BF]|Â[\u0080-\u00BF]|â[\u0080-\u00BF]{1,2}|ð[\u0080-\u00BF]{2,3})/g;

/**
 * Repairs only recognizable UTF-8-as-Latin-1 clusters from external feeds.
 * Ordinary Unicode, including accented letters and curly punctuation, is left
 * untouched. Invalid repair candidates are preserved rather than truncated.
 */
export function normalizeExternalText(value: string) {
  return value.replace(MOJIBAKE_CLUSTER, (cluster) => {
    const repaired = Buffer.from(cluster, "latin1").toString("utf8");
    return repaired.includes("\uFFFD") ? cluster : repaired;
  });
}
