import { useLocalStorageValue } from '@react-hookz/web';
import { useEffect, useState, MouseEvent, useRef } from 'react';
import styled from 'styled-components';
import { useColorContext } from '../contexts/color-context';
import { useCanvas } from '../hooks/use-canvas';
import { BsPencil } from 'react-icons/bs';

const Canvas = styled.canvas`
  cursor: none;
  background-color: white;
`;

const Container = styled.div`
  position: relative;
`;

interface MousePos {
  x: number;
  y: number;
}

const Cursor = styled.div`
  font-size: 2rem;
  position: absolute;
  pointer-events: none;
`;

const CursorIcon = styled(BsPencil)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const Editor = () => {
  const { currentColor, colorPalette } = useColorContext();
  const [pixels, setPixels] = useLocalStorageValue<(string | undefined)[]>(
    'pixels',
    Array(16 * 16).fill(undefined)
  );
  const [pos, setPos] = useState<MousePos | undefined>();
  const [needsRerender, setNeedsRerender] = useState(false);
  const isDrawing = useRef(false);

  const draw = (
    event: MouseEvent<HTMLCanvasElement>,
    ctx: CanvasRenderingContext2D
  ) => {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / ctx.canvas.width) * 16);
    const y = Math.floor(((event.clientY - rect.top) / ctx.canvas.height) * 16);
    const index = y * 16 + x;
    setPixels((pixels) =>
      pixels.map((pixel, i) => (i === index ? currentColor?.id : pixel))
    );
    setNeedsRerender(true);
  };

  const { render, ...handlers } = useCanvas({
    onMouseMove: (event, ctx) => {
      setCursorPos(event);
      if (!isDrawing.current) return;
      draw(event, ctx);
    },
    onMouseDown: (event, ctx) => {
      draw(event, ctx);
      isDrawing.current = true;
    },
    onMouseUp: () => (isDrawing.current = false),
    onRender: (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      pixels.forEach((pixel, i) => {
        if (!pixel) return;
        const y = Math.floor(i / 16);
        const x = i % 16;
        const color = colorPalette.find((color) => color.id === pixel);
        if (!color) throw new Error('No such color');
        ctx.fillStyle = color.value;
        ctx.fillRect(x * 16, y * 16, 16, 16);
      });
    },
  });

  useEffect(() => {
    setPixels((pixels) =>
      pixels.map((pixel) => {
        const stillExists = colorPalette.find((color) => color.id === pixel);
        return stillExists ? pixel : undefined;
      })
    );
    setNeedsRerender(true);
  }, [colorPalette]);

  useEffect(() => {
    if (!needsRerender) return;
    render();
    setNeedsRerender(false);
  }, [needsRerender]);

  const setCursorPos = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 16) * 16 + 8;
    const y = Math.floor((event.clientY - rect.top) / 16) * 16 + 8;
    setPos({ x, y });
  };

  return (
    <Container>
      <Canvas
        onMouseLeave={() => setPos(undefined)}
        width={16 * 16}
        height={16 * 16}
        style={{ border: '1px solid black' }}
        {...handlers}
      ></Canvas>
      {pos && (
        <Cursor
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            color: currentColor?.value ?? 'black',
          }}
        >
          <CursorIcon />
        </Cursor>
      )}
    </Container>
  );
};
