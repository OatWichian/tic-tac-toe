// auth
import { FirebaseGuard } from 'src/auth/guard';

// components
import DashboardLayout from 'src/layouts/dashboard/layout';

// sections
import { LeaderBoardListView } from 'src/sections/leader-board/view';

export default function LeaderBoardListViewPage() {
  return (
    // <FirebaseGuard>
      <DashboardLayout>
        <LeaderBoardListView />
      </DashboardLayout>
    // </FirebaseGuard>
  );
}
