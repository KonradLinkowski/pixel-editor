import { ColorPalette } from './components/color-palette';
import { ColorContextProvider } from './contexts/color-context';
import { Editor } from './components/editor';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const App = () => {
  return (
    <div className="App">
      <ColorContextProvider>
        <Container>
          <ColorPalette />
          <Editor />
        </Container>
      </ColorContextProvider>
    </div>
  );
};
