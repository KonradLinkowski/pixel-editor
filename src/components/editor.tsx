import { useLocalStorageValue } from '@react-hookz/web';
import { useEffect, useState, MouseEvent } from 'react';
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

interface CursorProps {
  pos: MousePos;
  colorValue?: string;
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

  const { ref, render, onClick } = useCanvas({
    onClick: (event, ctx) => {
      const rect = ctx.canvas.getBoundingClientRect();
      const x = Math.floor(
        ((event.clientX - rect.left) / ctx.canvas.width) * 16
      );
      const y = Math.floor(
        ((event.clientY - rect.top) / ctx.canvas.height) * 16
      );
      const index = y * 16 + x;
      setPixels((pixels) =>
        pixels.map((pixel, i) => (i === index ? currentColor?.id : pixel))
      );
    },
    onRender: (ctx) => {
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
    render();
  }, [pixels, colorPalette]);

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPos({ x, y });
  };

  return (
    <Container>
      <Canvas
        onMouseLeave={() => setPos(undefined)}
        onMouseMove={handleMouseMove}
        width={16 * 16}
        height={16 * 16}
        style={{ border: '1px solid black' }}
        ref={ref}
        onClick={onClick}
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
