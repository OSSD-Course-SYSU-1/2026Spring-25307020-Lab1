export class ColorUtil {
  static hexToRgb(hex: string): number[] {
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16)
    ]
  }

  static isLightColor(hex: string): boolean {
    const [r, g, b] = this.hexToRgb(hex)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.6
  }
}
