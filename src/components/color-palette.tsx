import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import { useColorContext } from '../contexts/color-context';
import { BlankTile, ColorTile } from './color-tile';
import * as HoverCard from '@radix-ui/react-hover-card';

const PaletteContainer = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, 1fr);
`;

const getRandomColor = () => {
  const random = () => Math.floor(Math.random() * 256).toString(16);

  return `#${random()}${random()}${random()}`;
};

export const ColorPalette = () => {
  const { currentColor, setCurrentColor, colorPalette, addColor, changeColor } =
    useColorContext();
  return (
    <div>
      <PaletteContainer>
        {colorPalette.map((color) => (
          <HoverCard.Root key={color.id}>
            <HoverCard.Trigger>
              <ColorTile
                colorData={color}
                current={currentColor?.id === color.id}
                onClick={() => setCurrentColor(color.id)}
              />
            </HoverCard.Trigger>
            <HoverCard.Content>
              <HoverCard.Arrow />
              <ChromePicker
                onChange={(value) => changeColor(color.id, value.hex)}
                color={color.value}
              />
            </HoverCard.Content>
          </HoverCard.Root>
        ))}
        <BlankTile onClick={() => addColor(getRandomColor())} />
      </PaletteContainer>
    </div>
  );
};
