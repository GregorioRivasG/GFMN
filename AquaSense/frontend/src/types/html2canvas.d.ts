import 'html2canvas';

declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    windowWidth?: number;
    windowHeight?: number;
    logging?: boolean;
    useCORS?: boolean;
    allowTaint?: boolean;
    ignoreElements?: (element: HTMLElement) => boolean;
  }
}