// Reads a stat like "500+", "Top 0.8%" or "1st / 40" and decides which way
// it should count and how to picture it. Rankings count towards the result:
// a placing climbs from last to its final spot, and a "Top x%" narrows down
// from 100%.

export type Count = {
  kind: "placing" | "count" | "share";
  from: number;
  to: number;
  // For a placing, the size of the field; otherwise the target value.
  field: number;
  format: (value: number) => string;
};

function ordinal(value: number) {
  const rounded = Math.round(value);
  const lastTwo = rounded % 100;
  const suffix =
    lastTwo >= 11 && lastTwo <= 13
      ? "th"
      : (["th", "st", "nd", "rd"][rounded % 10] ?? "th");
  return `${rounded}${suffix}`;
}

export function parseCount(value: string): Count | null {
  const placing = value.match(/^(\d+)(?:st|nd|rd|th)(\s*\/\s*)(\d+)$/i);
  if (placing) {
    const [, place, separator, field] = placing;
    return {
      kind: "placing",
      from: Number(field),
      to: Number(place),
      field: Number(field),
      format: (current) => `${ordinal(current)}${separator}${field}`,
    };
  }

  const plain = value.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!plain) {
    return null;
  }
  const [, prefix, number, suffix] = plain;
  const decimals = number.split(".")[1]?.length ?? 0;
  const isTopShare = /top/i.test(prefix) && suffix.trim() === "%";

  return {
    kind: isTopShare ? "share" : "count",
    from: isTopShare ? 100 : 0,
    to: Number(number),
    field: Number(number),
    format: (current) => `${prefix}${current.toFixed(decimals)}${suffix}`,
  };
}
