import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Color } from '../types/color';
import { v4 as uuid } from 'uuid';
import { useLocalStorageValue } from '@react-hookz/web';

export interface ColorContextData {
  currentColor: Color;
  setCurrentColor: (id: string) => void;
  colorPalette: Color[];
  addColor: (value: string) => void;
  removeColor: (id: string) => void;
  changeColor: (id: string, value: string) => void;
}

const ColorContext = createContext<ColorContextData | undefined>(undefined);

export const ColorContextProvider = ({ children }: { children: ReactNode }) => {
  const [colorPalette, setColorPalette] = useLocalStorageValue<Color[]>(
    'color-palette',
    [
      {
        id: uuid(),
        value: '#ff00ff',
      },
    ]
  );
  const [currentColor, setColor] = useLocalStorageValue<Color>(
    'current-color',
    colorPalette[0]
  );

  const { setCurrentColor, addColor, removeColor, changeColor } = useMemo(
    () => ({
      setCurrentColor: (id: string) =>
        setColor(
          colorPalette.find((color) => color.id === id) ?? colorPalette[0]
        ),
      addColor: (value: string) =>
        setColorPalette((pal) => [...pal, { id: uuid(), value }]),
      removeColor: (id: string) => {
        const newPalette = colorPalette.filter((c) => c.id !== id);
        setColorPalette(newPalette);
        if (currentColor.id === id) {
          setColor(newPalette[0]);
        }
      },
      changeColor: (id: string, value: string) =>
        setColorPalette((pal) =>
          pal.map((c) => (c.id === id ? { id, value } : c))
        ),
    }),
    [setColor, colorPalette, setColorPalette, currentColor]
  );

  return (
    <ColorContext.Provider
      value={{
        currentColor,
        setCurrentColor,
        addColor,
        changeColor,
        colorPalette,
        removeColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context)
    throw new Error('useColorContext must be used inside ColorContextProvider');
  return context;
};
