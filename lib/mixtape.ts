export function sideBreak(total: number) {
  return Math.ceil(total / 2)
}

export function sideFor(index: number, total: number): "A" | "B" {
  return index < sideBreak(total) ? "A" : "B"
}
