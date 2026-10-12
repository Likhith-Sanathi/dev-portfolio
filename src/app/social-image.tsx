import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { portfolio } from "@/lib/portfolio-content";

export const socialImageAlt = `${portfolio.name} developer portfolio preview`;

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export const socialImageContentType = "image/png";

const geistRegular = readFile(
  join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf"),
);

const geistSemiBold = readFile(
  join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"),
);

const paper = "#f3f2ee";
const ink = "#111110";
const mute = "#5f5e59";
const signal = "#d32a1d";

const [firstName, lastName] = portfolio.name.split(" ");

const meta = [
  ["Discipline", "Computer Science"],
  ["Studying", portfolio.education[0].institution],
  ["Based in", portfolio.location],
] as const;

const focusAreas = ["Systems", "AI Tooling", "Verification", "Quant ML"];

export async function createSocialImageResponse() {
  const [regularFont, semiBoldFont] = await Promise.all([
    geistRegular,
    geistSemiBold,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: paper,
          color: ink,
          fontFamily: "Geist",
          padding: "44px 56px 52px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderTop: `2px solid ${ink}`,
            paddingTop: 16,
          }}
        >
          <div style={{ display: "flex" }}>
            {meta.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 272,
                  fontSize: 21,
                  lineHeight: 1.3,
                }}
              >
                <div style={{ display: "flex", color: mute }}>{label}</div>
                <div style={{ display: "flex", fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", width: 84, height: 84, backgroundColor: signal }} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 212,
              fontWeight: 600,
              lineHeight: 0.8,
              letterSpacing: "-0.065em",
              marginLeft: -10,
            }}
          >
            <div style={{ display: "flex" }}>{firstName}</div>
            <div style={{ display: "flex" }}>
              {lastName}
              <span style={{ color: signal }}>.</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 272,
              fontSize: 21,
              borderTop: `2px solid ${ink}`,
            }}
          >
            {focusAreas.map((area, index) => (
              <div
                key={area}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid #cfcdc5",
                  fontWeight: 600,
                }}
              >
                <span>{area}</span>
                <span style={{ color: mute, fontWeight: 400 }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
      fonts: [
        {
          name: "Geist",
          data: regularFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Geist",
          data: semiBoldFont,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
