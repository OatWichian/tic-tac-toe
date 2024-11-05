import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export function useNavData() {
  const data = useMemo(
    () => [
      {
        subheader: 'Game',
        items: [
          {
            title: 'TicTacToe',
            path: paths.dashboard.game.ticTacToe,
            icon: <SportsEsportsIcon />,
          },
          {
            title: 'Leader Board',
            path: paths.dashboard.leaderBoard.leaderBoardList,
            icon: <LeaderboardOutlinedIcon />,
          },
        ],
      },
    ],
    [],
  );

  return data;
}
