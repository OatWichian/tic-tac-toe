// auth
import { FirebaseGuard } from 'src/auth/guard';

// components
import DashboardLayout from 'src/layouts/dashboard/layout';

// sections
import { TicTacToe } from 'src/sections/game/view';

export default function TicTacToePage() {
  return (
    <FirebaseGuard>
      <DashboardLayout>
        <TicTacToe />
      </DashboardLayout>
    </FirebaseGuard>
  );
}
