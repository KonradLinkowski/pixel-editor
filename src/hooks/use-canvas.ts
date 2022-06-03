import { MouseEvent, useCallback, useEffect, useRef } from 'react';

export interface UseCanvasProps {
  onClick: (
    event: MouseEvent<HTMLCanvasElement>,
    ctx: CanvasRenderingContext2D
  ) => void;
  onRender: (ctx: CanvasRenderingContext2D) => void;
}

export const useCanvas = ({ onClick, onRender }: UseCanvasProps) => {
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

  const internalOnClick = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const ctx = contextRef.current;
      if (!ctx) throw new Error('Context is not initialized');
      onClick(event, ctx);
    },
    [onClick]
  );

  return {
    ref: canvasRef,
    onClick: internalOnClick,
    render: internalOnRender,
  };
};
