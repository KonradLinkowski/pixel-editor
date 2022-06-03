import styled from 'styled-components';
import { Color } from '../types/color';
import { MdAdd } from 'react-icons/md';

interface TileProps {
  current?: boolean;
  colorValue: string;
}

const Tile = styled.div<TileProps>`
  width: 100px;
  height: 100px;
  cursor: pointer;
  display: flex;
  font-size: 3rem;
  justify-content: center;
  align-items: center;
  background-color: ${({ colorValue }) => colorValue};
  border: ${({ current }) => (current ? '2px solid black' : 'none')};
`;

const Text = styled.div`
  width: 100%;
  height: 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export interface ColorTileProps {
  current?: boolean;
  colorData: Color;
  onClick: () => void;
}

export const ColorTile = ({
  current = false,
  colorData,
  onClick,
}: ColorTileProps) => {
  return (
    <Container>
      <Tile onClick={onClick} current={current} colorValue={colorData.value} />
      <Text>{colorData.value}</Text>
    </Container>
  );
};

export interface BlankTileProps {
  onClick: () => void;
}

export const BlankTile = ({ onClick }: BlankTileProps) => {
  return (
    <Container onClick={onClick}>
      <Tile current={true} colorValue="#ffffff">
        <MdAdd />
      </Tile>
      <Text>Add color</Text>
    </Container>
  );
};
