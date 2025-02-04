declare module 'canvas-capture' {
  export function init(canvas: HTMLCanvasElement, options?: any): void;
  export function beginVideoRecord(options: any): void;
  export function stopRecord(): void;
  export function save(): void;
  export const WEBM: string;
}