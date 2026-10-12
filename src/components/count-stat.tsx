"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Count = {
  from: number;
  to: number;
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

// Reads a stat like "500+", "Top 0.8%" or "1st / 40" and decides which way
// it should count. Rankings count towards the result: a placing climbs from
// last to its final spot, and a "Top x%" narrows down from 100%.
function parseCount(value: string): Count | null {
  const placing = value.match(/^(\d+)(?:st|nd|rd|th)(\s*\/\s*)(\d+)$/i);
  if (placing) {
    const [, place, separator, field] = placing;
    return {
      from: Number(field),
      to: Number(place),
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
    from: isTopShare ? 100 : 0,
    to: Number(number),
    format: (current) => `${prefix}${current.toFixed(decimals)}${suffix}`,
  };
}

// A stat that counts to its value as it scrolls into place. Screen readers
// and reduced-motion visitors get the final value straight away.
export function CountStat({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = parseCount(value);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 40%"],
  });
  const text = useTransform(scrollYProgress, (progress) => {
    if (!count) {
      return value;
    }
    const t = 1 - (1 - Math.min(1, Math.max(0, progress))) ** 3;
    return count.format(count.from + (count.to - count.from) * t);
  });

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <motion.span aria-hidden="true" className="tabular-nums motion-reduce:hidden">
        {text}
      </motion.span>
      <span aria-hidden="true" className="hidden motion-reduce:inline">
        {value}
      </span>
    </span>
  );
}
