import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Color } from '../types/color';
import { v4 as uuid } from 'uuid';

export interface ColorContextData {
  currentColor: Color | undefined;
  setCurrentColor: (id: string) => void;
  colorPalette: Color[];
  addColor: (value: string) => void;
  removeColor: (id: string) => void;
  changeColor: (id: string, value: string) => void;
}

const ColorContext = createContext<ColorContextData | undefined>(undefined);

export const ColorContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentColor, setColor] = useState<Color>();
  const [colorPalette, setColorPalette] = useState<Color[]>([
    {
      id: uuid(),
      value: '#ff00ff',
    },
  ]);

  const { setCurrentColor, addColor, removeColor, changeColor } = useMemo(
    () => ({
      setCurrentColor: (id: string) =>
        setColor(colorPalette.find((color) => color.id === id)),
      addColor: (value: string) =>
        setColorPalette((pal) => [...pal, { id: uuid(), value }]),
      removeColor: (id: string) =>
        setColorPalette((pal) => pal.filter((c) => c.id !== id)),
      changeColor: (id: string, value: string) =>
        setColorPalette((pal) =>
          pal.map((c) => (c.id === id ? { id, value } : c))
        ),
    }),
    [setColor, colorPalette, setColorPalette]
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
