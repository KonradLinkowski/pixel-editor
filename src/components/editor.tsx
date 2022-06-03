import { useLocalStorageValue } from '@react-hookz/web';
import { useEffect, useState } from 'react';
import { useColorContext } from '../contexts/color-context';
import { useCanvas } from '../hooks/use-canvas';

export const Editor = () => {
  const { currentColor, colorPalette } = useColorContext();
  const [pixels, setPixels] = useLocalStorageValue<(string | undefined)[]>(
    'pixels',
    Array(16 * 16).fill(undefined)
  );
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

  return (
    <canvas
      width={16 * 16}
      height={16 * 16}
      style={{ border: '1px solid black' }}
      ref={ref}
      onClick={onClick}
    ></canvas>
  );
};
