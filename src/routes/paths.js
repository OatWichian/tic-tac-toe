// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  FORMS: '/forms',
};

// ----------------------------------------------------------------------

export const paths = {
  api: {
    ssr: {
      info: `/api/ssr/info`,
    },
  },
  // minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      createUser: `${ROOTS.AUTH}/jwt/create-user`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    game: {
      ticTacToe: `${ROOTS.DASHBOARD}/game/tic-tac-toe/`,
    },
    leaderBoard: {
      leaderBoardList: `${ROOTS.DASHBOARD}/leader-board/`,
    },
  },
};
