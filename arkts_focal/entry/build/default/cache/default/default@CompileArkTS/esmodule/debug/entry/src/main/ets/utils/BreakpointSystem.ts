/**
 * 响应式布局断点系统
 * 支持手机(sm)、平板(md)、大屏(lg)三种尺寸
 */
export enum BreakpointType {
    SM = "sm",
    MD = "md",
    LG = "lg" // 大屏 > 840vp
}
// 内边距接口
export interface PaddingConfig {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export class BreakpointSystem {
    private static currentBreakpoint: BreakpointType = BreakpointType.SM;
    private static windowWidth: number = 360;
    // 更新窗口宽度
    static updateWidth(width: number): void {
        BreakpointSystem.windowWidth = width;
        if (width < 600) {
            BreakpointSystem.currentBreakpoint = BreakpointType.SM;
        }
        else if (width < 840) {
            BreakpointSystem.currentBreakpoint = BreakpointType.MD;
        }
        else {
            BreakpointSystem.currentBreakpoint = BreakpointType.LG;
        }
    }
    // 获取当前断点
    static getBreakpoint(): BreakpointType {
        return BreakpointSystem.currentBreakpoint;
    }
    // 获取窗口宽度
    static getWidth(): number {
        return BreakpointSystem.windowWidth;
    }
    // 是否是手机
    static isPhone(): boolean {
        return BreakpointSystem.currentBreakpoint === BreakpointType.SM;
    }
    // 是否是平板
    static isTablet(): boolean {
        return BreakpointSystem.currentBreakpoint === BreakpointType.MD;
    }
    // 是否是大屏
    static isLarge(): boolean {
        return BreakpointSystem.currentBreakpoint === BreakpointType.LG;
    }
    // 根据断点返回不同值
    static select<T>(sm: T, md: T, lg: T): T {
        switch (BreakpointSystem.currentBreakpoint) {
            case BreakpointType.SM:
                return sm;
            case BreakpointType.MD:
                return md;
            case BreakpointType.LG:
                return lg;
            default:
                return sm;
        }
    }
    // 获取网格列数
    static getGridColumns(): number {
        return BreakpointSystem.select(2, 3, 4);
    }
    // 获取卡片宽度
    static getCardWidth(): string {
        return BreakpointSystem.select('48%', '32%', '24%');
    }
    // 获取字体大小
    static getFontSize(base: number): number {
        return BreakpointSystem.select(base, base * 1.1, base * 1.2);
    }
    // 获取间距
    static getSpacing(base: number): number {
        return BreakpointSystem.select(base, base * 1.5, base * 2);
    }
    // 获取内边距
    static getPadding(): PaddingConfig {
        const smPadding: PaddingConfig = { left: 16, right: 16, top: 12, bottom: 12 };
        const mdPadding: PaddingConfig = { left: 24, right: 24, top: 16, bottom: 16 };
        const lgPadding: PaddingConfig = { left: 32, right: 32, top: 20, bottom: 20 };
        return BreakpointSystem.select(smPadding, mdPadding, lgPadding);
    }
}
