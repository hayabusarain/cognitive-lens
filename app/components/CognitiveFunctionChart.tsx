"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  AXIS_ORDER,
  FUNCTION_LABELS,
  FUNCTION_SCORES,
  getDomInf,
  type CognitiveFunction,
  type FunctionScores,
} from "@/lib/cognitive-functions";

// ── Fixed modern chart colors ─────────────────────────────────
const COLORS = {
  primary:    "#14b8a6",
  compare:    "#a78bfa",
  inferior:   "#f43f5e",
  grid:       "#e2e8f0",
  axisLabel:  "#334155",
  axisSub:    "#94a3b8",
};

// ── Types ─────────────────────────────────────────────────────

interface Props {
  typeKey: string;
  compareTypeKey?: string;
  size?: number;
}

interface ChartEntry {
  fn: CognitiveFunction;
  value: number;
  compareValue?: number;
}

// ── Custom tick ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AxisTick(props: any) {
  const { x, y, payload, textAnchor } = props as {
    x: number;
    y: number;
    payload: { value: string };
    textAnchor: string;
  };
  const fn = payload.value as CognitiveFunction;
  const label = FUNCTION_LABELS[fn];
  if (!label) return null;
  const anchor = (textAnchor as "start" | "middle" | "end") ?? "middle";
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor={anchor}
        fill={COLORS.axisLabel}
        fontSize={11}
        fontWeight="700"
        dy={-5}
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        {label.en}
      </text>
      <text
        textAnchor={anchor}
        fill={COLORS.axisSub}
        fontSize={8.5}
        dy={7}
      >
        {label.ja}
      </text>
    </g>
  );
}

// ── Custom dot ───────────────────────────────────────────────

function makeDot(
  domFn: CognitiveFunction | null,
  infFn: CognitiveFunction | null,
  baseColor: string
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function CustomDot(props: any) {
    const { cx, cy, payload } = props as {
      cx: number;
      cy: number;
      payload: ChartEntry;
    };
    const fn = payload.fn;
    if (fn === domFn) {
      return (
        <>
          <circle cx={cx} cy={cy} r={9} fill={baseColor} fillOpacity={0.2} />
          <circle cx={cx} cy={cy} r={5} fill={baseColor} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
        </>
      );
    }
    if (fn === infFn) {
      return (
        <circle cx={cx} cy={cy} r={4} fill={COLORS.inferior} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
      );
    }
    return <circle cx={cx} cy={cy} r={2.5} fill={baseColor} fillOpacity={0.7} />;
  };
}

// ── Chart data builder ───────────────────────────────────────

function buildData(primary: FunctionScores, compare?: FunctionScores): ChartEntry[] {
  return AXIS_ORDER.map((fn) => ({
    fn,
    value: primary[fn],
    ...(compare ? { compareValue: compare[fn] } : {}),
  }));
}

// ── Legend ──────────────────────────────────────────────────

function Legend({
  typeKey,
  compareTypeKey,
}: {
  typeKey: string;
  compareTypeKey?: string;
}) {
  const { dom, inf } = getDomInf(typeKey);
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-2 px-2">
      <div className="flex items-center gap-1.5">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: COLORS.primary, boxShadow: `0 0 0 3px ${COLORS.primary}40` }}
        />
        <span className="text-[10px] font-mono" style={{ color: COLORS.axisSub }}>{typeKey}</span>
        {dom && (
          <span className="text-[10px] font-bold" style={{ color: COLORS.primary }}>
            Dom:{dom}
          </span>
        )}
        {inf && (
          <span className="text-[10px] font-bold" style={{ color: COLORS.inferior }}>
            Inf:{inf}
          </span>
        )}
      </div>
      {compareTypeKey && (
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.compare, boxShadow: `0 0 0 3px ${COLORS.compare}40` }}
          />
          <span className="text-[10px] font-mono" style={{ color: COLORS.axisSub }}>
            {compareTypeKey}
          </span>
          {(() => {
            const { dom: cd, inf: ci } = getDomInf(compareTypeKey);
            return (
              <>
                {cd && (
                  <span className="text-[10px] font-bold" style={{ color: COLORS.compare }}>
                    Dom:{cd}
                  </span>
                )}
                {ci && (
                  <span className="text-[10px] font-bold" style={{ color: COLORS.inferior }}>
                    Inf:{ci}
                  </span>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────

export default function CognitiveFunctionChart({
  typeKey,
  compareTypeKey,
  size = 320,
}: Props) {
  const scores = FUNCTION_SCORES[typeKey];
  if (!scores) return null;

  const compareScores = compareTypeKey ? FUNCTION_SCORES[compareTypeKey] : undefined;
  const data = buildData(scores, compareScores);

  const { dom, inf } = getDomInf(typeKey);
  const height = Math.round(size * 0.87);
  const outerR = Math.round(height * 0.31);

  const PrimaryDot = makeDot(dom, inf, COLORS.primary);
  const CompareDot = compareTypeKey
    ? makeDot(getDomInf(compareTypeKey).dom, getDomInf(compareTypeKey).inf, COLORS.compare)
    : undefined;

  return (
    <div className="flex flex-col items-center">
      <RadarChart
        width={size}
        height={height}
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={outerR}
      >
        <PolarGrid gridType="polygon" stroke={COLORS.grid} strokeWidth={1} />

        <PolarAngleAxis
          dataKey="fn"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tick={AxisTick as any}
          tickLine={false}
        />

        <PolarRadiusAxis
          domain={[0, 100]}
          tick={false}
          axisLine={false}
          tickLine={false}
        />

        <Radar
          dataKey="value"
          stroke={COLORS.primary}
          strokeWidth={2}
          fill={COLORS.primary}
          fillOpacity={compareTypeKey ? 0.18 : 0.28}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dot={PrimaryDot as any}
          activeDot={false}
          isAnimationActive={false}
        />

        {compareTypeKey && compareScores && CompareDot && (
          <Radar
            dataKey="compareValue"
            stroke={COLORS.compare}
            strokeWidth={2}
            fill={COLORS.compare}
            fillOpacity={0.18}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dot={CompareDot as any}
            activeDot={false}
            isAnimationActive={false}
          />
        )}
      </RadarChart>

      <Legend typeKey={typeKey} compareTypeKey={compareTypeKey} />
    </div>
  );
}
