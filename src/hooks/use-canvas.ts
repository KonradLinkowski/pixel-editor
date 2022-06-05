import { MouseEvent, useCallback, useEffect, useRef } from 'react';

export interface UseCanvasProps {
  onMouseDown: (
    event: MouseEvent<HTMLCanvasElement>,
    ctx: CanvasRenderingContext2D
  ) => void;
  onMouseUp: (
    event: MouseEvent<HTMLCanvasElement>,
    ctx: CanvasRenderingContext2D
  ) => void;
  onMouseMove: (
    event: MouseEvent<HTMLCanvasElement>,
    ctx: CanvasRenderingContext2D
  ) => void;
  onRender: (ctx: CanvasRenderingContext2D) => void;
}

export const useCanvas = ({
  onRender,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) throw new Error('Canvas ref is null');
    contextRef.current = canvasRef.current?.getContext('2d');
  }, []);

  const internalOnRender = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) throw new Error('Context is not initialized');
    onRender(ctx);
  }, [onRender]);

  const internalOnMouseDown = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const ctx = contextRef.current;
      if (!ctx) throw new Error('Context is not initialized');
      onMouseDown(event, ctx);
    },
    [onMouseDown]
  );

  const internalOnMouseUp = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const ctx = contextRef.current;
      if (!ctx) throw new Error('Context is not initialized');
      onMouseUp(event, ctx);
    },
    [onMouseUp]
  );

  const internalOnMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const ctx = contextRef.current;
      if (!ctx) throw new Error('Context is not initialized');
      onMouseMove(event, ctx);
    },
    [onMouseMove]
  );

  return {
    ref: canvasRef,
    onMouseDown: internalOnMouseDown,
    onMouseUp: internalOnMouseUp,
    onMouseMove: internalOnMouseMove,
    render: internalOnRender,
  };
};
