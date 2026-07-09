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

const geistMono = readFile(
  join(
    process.cwd(),
    "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf",
  ),
);

const skillPills = ["Systems", "AI Tooling", "Verification", "Quant ML"];

export async function createSocialImageResponse() {
  const [regularFont, semiBoldFont, monoFont] = await Promise.all([
    geistRegular,
    geistSemiBold,
    geistMono,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#030303",
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.12), transparent 24%), linear-gradient(135deg, #1a1a1a 0%, #070707 52%, #0c0c0c 100%)",
          color: "#f5f5f5",
          padding: 30,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "100% 8px, 8px 100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: 34,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 30px 120px rgba(0,0,0,0.45)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative",
            borderRadius: 34,
            overflow: "hidden",
            padding: 34,
            gap: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.28)",
                  padding: "10px 16px",
                  fontFamily: "Geist Mono",
                  fontSize: 14,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.74)",
                }}
              >
                Developer Portfolio
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Geist Mono",
                  fontSize: 14,
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                {portfolio.location}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                maxWidth: 640,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontSize: 16,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.56)",
                }}
              >
                {portfolio.role}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist",
                  fontSize: 84,
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                  fontWeight: 600,
                }}
              >
                {portfolio.name}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist",
                  fontSize: 30,
                  lineHeight: 1.35,
                  color: "rgba(255,255,255,0.82)",
                  maxWidth: 760,
                }}
              >
                Production-minded software across systems, AI tooling,
                verification, and quantitative ML.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {skillPills.map((pill) => (
                <div
                  key={pill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "12px 18px",
                    fontFamily: "Geist",
                    fontSize: 18,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 352,
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.3)",
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontSize: 14,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                Selected signals
              </div>
              {portfolio.stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "Geist Mono",
                      fontSize: 26,
                      color: "#ffffff",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "Geist",
                      fontSize: 16,
                      lineHeight: 1.3,
                      color: "rgba(255,255,255,0.68)",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                flex: 1,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontSize: 14,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                Right now
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist",
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: "rgba(255,255,255,0.86)",
                }}
              >
                {portfolio.availability}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "Geist Mono",
                  fontSize: 13,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.52)",
                }}
              >
                University College Cork
              </div>
            </div>
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
        {
          name: "Geist Mono",
          data: monoFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
