import * as React from "react";
import {Provider, useDispatch, useSelector } from "react-redux";
import {configureStore, createSlice } from "@reduxjs/toolkit";
import {Box, Button, ChakraProvider, Flex, Text, VStack } from '@chakra-ui/react';

let data = createSlice({
  name: "data",
  initialState: {
    currentStep: 0,
    winner: null,
    nextValue: "X",
    status: "Next Player: X",
    squares: Array(9).fill(null),
  },
  reducers: {
    selectSquare(state, action) {
      if (!state.winner && !state.squares[action.payload]) {
        const newSquares = [...state.squares];
        newSquares[action.payload] = calculateNextValue(state.squares);
        const winner = calculateWinner(newSquares);
        const nextValue = calculateNextValue(newSquares);
        const status = calculateStatus(winner, newSquares, nextValue);
        return {
          squares: newSquares,
          winner,
          nextValue,
          status,
        };
      }
    },
    restart() {
      const newSquares = Array(9).fill(null);
      const winner = calculateWinner(newSquares);
      const nextValue = calculateNextValue(newSquares);
      const status = calculateStatus(winner, newSquares, nextValue);
      return {
        squares: newSquares,
        winner,
        nextValue,
        status,
      };
    },
  },
});

export const { selectSquare, restart, jumpToMove } = data.actions;

const store = configureStore({
  reducer: data.reducer,
});
function Board() {
  const { status, squares } = useSelector((state) => state);
  const dispatch = useDispatch();
  function selectSquareHandler(squareIndex) {
    dispatch(selectSquare(squareIndex));
  };

  // const nextValue = calculateNextValue(squares)
  // const winner = calculateWinner(squares)
  // const status = calculateStatus(winner, squares, nextValue)

  function renderSquare(i) {
    return (
      <Button 
      w='100px'
      h='100px'
      variant='outlined'
      borderWidth='2px'
      borderStyle='solid'
      borderColor='white'
      m='1'
      onClick={() => selectSquareHandler(i)}
      >
        {squares[i]}
      </Button>
    );
  }

  return (
    <VStack>
      <Text color='white' fontWeight='bold'>{status}</Text>
      <Flex className='board-row'>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </Flex>
      <Flex className='board-row'>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </Flex>
      <Flex>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </Flex>
    </VStack>
  );
}

function Game() {
  const dispatch = useDispatch();
  const handlerRestart = () => {
    dispatch(restart());
  };
  return (
    <Box bgGradient='linear(to-t, blue.300, blue.100, blue.300)' p={10}>
      <Box maxW='500px' mx='auto'  p={4} borderRadius='lg'>
        <Board />
       <Flex pt='2'>
       <Button
          onClick={handlerRestart}
          className='restart'
          fontWeight='bold'
          color='blackAlpha.400'
          variant='outline'
          size='md'
          mx='auto'
          p='5'
        >
          Restart
        </Button>
       </Flex>
      </Box>
    </Box>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? "X" : "O";
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return(
  <ChakraProvider>
    <Provider store={store}>
<Game />;
    </Provider>
  </ChakraProvider>
  )
}

export default App;
