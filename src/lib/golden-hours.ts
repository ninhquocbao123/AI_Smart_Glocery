export type GoldenConfig = {
  windows: { start: number; end: number }[];
  disabledIds: string[];
  selectedIds?: string[];
};
export const DEFAULT_GOLDEN: GoldenConfig = {
  windows: [
    { start: 660, end: 780 },
    { start: 1020, end: 1140 },
  ],
  disabledIds: [],
};
export function goldenStatus(
  config: GoldenConfig = DEFAULT_GOLDEN,
  now = new Date(),
) {
  const local = new Date(+now + 7 * 3600000),
    minute = local.getUTCHours() * 60 + local.getUTCMinutes();
  const active = config.windows.some(
    (w) => minute >= w.start && minute < w.end,
  );
  const clock = (n: number) =>
    `${Math.floor(n / 60)
      .toString()
      .padStart(2, "0")}:${(n % 60).toString().padStart(2, "0")}`;
  return {
    active,
    endsAt: active
      ? new Date(+now + ((config.windows.find(w => minute >= w.start && minute < w.end)!.end - minute) * 60 - local.getUTCSeconds()) * 1000 - local.getUTCMilliseconds()).toISOString()
      : null,
    label: config.windows
      .map((w) => `${clock(w.start)}–${clock(w.end)}`)
      .join(" và "),
  };
}
export function goldenPrice(
  price: number,
  originalPrice: number | undefined,
  id: string,
  config: GoldenConfig,
  now = new Date(),
) {
  return originalPrice &&
    originalPrice > price &&
    (config.disabledIds.includes(id) ||
      (config.selectedIds !== undefined && !config.selectedIds.includes(id)) ||
      !goldenStatus(config, now).active)
    ? originalPrice
    : price;
}
