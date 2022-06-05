import styled from 'styled-components';
import { Color } from '../types/color';
import { MdAdd, MdClose } from 'react-icons/md';

interface TileProps {
  current?: boolean;
  colorValue: string;
}

const Tile = styled.div<TileProps>`
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  display: flex;
  font-size: 3rem;
  justify-content: center;
  align-items: center;
  background-color: ${({ colorValue }) => colorValue};
  border: ${({ current }) => (current ? '2px solid white' : 'none')};
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

const Delete = styled.button`
  top: 0;
  right: 0;
  position: absolute;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

export interface ColorTileProps {
  current?: boolean;
  colorData: Color;
  onClick: () => void;
  onDelete: () => void;
}

export const ColorTile = ({
  current = false,
  colorData,
  onClick,
  onDelete,
}: ColorTileProps) => {
  return (
    <Container>
      <Tile onClick={onClick} current={current} colorValue={colorData.value}>
        <Delete
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <MdClose />
        </Delete>
      </Tile>
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
