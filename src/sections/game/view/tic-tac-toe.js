import * as Actions from '@actions';
import Page from '@components/page';
import { useSettingsContext } from '@components/settings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const WINNING_COMBO = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe() {
  const dispatch = useDispatch();
  const settings = useSettingsContext();

  const { userData } = useSelector(({ userInfo }) => userInfo);
  const { gameScoreIndividual } = useSelector(({ game }) => game);

  const [xTurn, setXTurn] = useState(true);
  const [won, setWon] = useState(false);
  const [wonCombo, setWonCombo] = useState([]);
  const [boardData, setBoardData] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
  });
  const [isDraw, setIsDraw] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    checkWinner();
    if (!won) {
      checkDraw();
    } else {
      updateGameScore(!xTurn ? 'win' : 'lost');
    }
  }, [won, boardData]);

  useEffect(() => {
    if (!xTurn && !won && !isDraw) {
      botMove();
    }
  }, [xTurn]);

  const updateBoardData = (idx) => {
    if (!boardData[idx] && !won) {
      let value = xTurn ? 'X' : 'O';
      setBoardData({ ...boardData, [idx]: value });
      setXTurn(!xTurn);
    }
  };

  const getBestMove = () => {
    // ตรวจสอบว่าผู้เล่นกำลังจะชนะหรือไม่ ถ้าใช่ บอทจะป้องกัน
    for (let [a, b, c] of WINNING_COMBO) {
      if (boardData[a] === 'O' && boardData[b] === 'O' && !boardData[c]) return updateBoardData(c);
      if (boardData[a] === 'O' && boardData[c] === 'O' && !boardData[b]) return updateBoardData(b);
      if (boardData[b] === 'O' && boardData[c] === 'O' && !boardData[a]) return updateBoardData(a);
    }

    // 2. Block the player if they're about to win
    for (let [a, b, c] of WINNING_COMBO) {
      if (boardData[a] === 'X' && boardData[b] === 'X' && !boardData[c]) return updateBoardData(c);
      if (boardData[a] === 'X' && boardData[c] === 'X' && !boardData[b]) return updateBoardData(b);
      if (boardData[b] === 'X' && boardData[c] === 'X' && !boardData[a]) return updateBoardData(a);
    }
    return null;
  };

  const botMove = () => {
    // หาช่องที่ดีที่สุดเพื่อป้องกัน
    const bestMove = getBestMove();
    if (bestMove !== null) {
      setBoardData((prevBoardData) => ({
        ...prevBoardData,
        [bestMove]: 'O',
      }));
      setXTurn(true);
      return;
    }

    // ถ้าไม่มีช่องต้องป้องกัน บอทจะสุ่มเลือกช่องว่าง
    const emptyIndices = Object.keys(boardData).filter((key) => !boardData[key]);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      setBoardData((prevBoardData) => ({
        ...prevBoardData,
        [randomIndex]: 'O',
      }));
      setXTurn(true);
    }
  };

  const checkDraw = () => {
    let check = Object.keys(boardData).every((v) => boardData[v]);
    setIsDraw(check);
    if (check) setModalTitle('Match Draw!!!');
  };

  const checkWinner = () => {
    WINNING_COMBO.forEach((bd) => {
      const [a, b, c] = bd;
      if (boardData[a] && boardData[a] === boardData[b] && boardData[a] === boardData[c]) {
        setWon(true);
        setWonCombo([a, b, c]);
        setModalTitle(`Player ${!xTurn ? 'X' : 'Bot'} Win!!!`);
        return;
      }
    });
  };

  const reset = () => {
    setBoardData({
      0: '',
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
    });
    setXTurn(true);
    setWon(false);
    setWonCombo([]);
    setIsDraw(false);
    setModalTitle('');
  };

  const updateGameScore = (result) => {
    dispatch(Actions.fetchGameScoreUpdate({ gameResult: result }));
  };

  useEffect(() => {
    if (gameScoreIndividual?.uuid) {
      dispatch(Actions.fetchUserInfo());
    }
  }, [gameScoreIndividual]);

  const ScoreBoard = ({ score, streak }) => {
    return (
      <Grid container justifyContent={'center'} sx={{ mb: 2 }}>
        <Grid item sm={4} xs={11}>
          <PlayerScoreCard>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Tic Tac Toe
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <StyledAvatar player="X">
                  <SportsEsportsIcon fontSize="large" />
                </StyledAvatar>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Score: <strong>{score}</strong>
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Streak: <strong>{streak}</strong>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </PlayerScoreCard>
        </Grid>
      </Grid>
    );
  };

  return (
    <Page title="TicTacToe | Dashboard">
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction={'column'}>
          <ScoreBoard score={userData.totalScore} streak={userData.winContinuous} />
        </Stack>
        <br />

        <GameContainer>
          <GameBoard>
            {[...Array(9)].map((_, idx) => (
              <Square
                onClick={() => updateBoardData(idx)}
                key={idx}
                className={wonCombo.includes(idx) ? 'highlight' : ''}
              >
                {boardData[idx]}
              </Square>
            ))}
          </GameBoard>
          <Modal className={modalTitle ? 'show' : ''}>
            <ModalTitle>{modalTitle}</ModalTitle>
            <Button onClick={() => reset()}>New Game</Button>
          </Modal>
        </GameContainer>
      </Container>
    </Page>
  );
}

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 8px;
`;

const Square = styled.div`
  background-color: #eee;
  border-radius: 8px;
  box-shadow: 0px 4px #ddd;
  text-align: center;
  font-size: 64px;
  line-height: 100px;
  font-weight: bold;
  width: 100px;
  height: 100px;
  cursor: pointer;

  &.highlight {
    background-color: aquamarine;
    box-shadow: none;
  }
`;

const Modal = styled.div`
  width: 320px;
  border-radius: 16px;
  box-shadow: 0px 0px 10px 0px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  position: fixed;
  top: 50%;
  background-color: white;
  left: 60%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s;

  &.show {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Button = styled.button`
  border: none;
  width: 100%;
  height: 36px;
  font-size: 18px;
  font-weight: 600;
`;

const PlayerScoreCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledAvatar = styled(Avatar)`
  background-color: ${({ player }) => (player === 'X' ? '#FF7043' : '#42A5F5')};
  width: 36px;
  height: 36px;
`;
