import { useEffect, useRef } from "react";

const useCanvas = (draw: (context: CanvasRenderingContext2D) => void) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement = ref.current!;
    const context = canvas.getContext("2d")!;

    draw(context);
  }, [draw]);

  return ref;
};

export default useCanvas;
