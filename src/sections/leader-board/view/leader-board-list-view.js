import { TablePaginationMaster } from '@components/table-master';
import CustomBreadcrumbs from '@components/custom-breadcrumbs/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Divider } from '@mui/material';
import Container from '@mui/material/Container';
//
import * as Actions from '@actions';
import Page from '@components/page';
import { useTable } from '@components/table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Label from 'src/components/label';

const LeaderBoardListView = () => {
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const userInfoLoading = useSelector((state) => state?.userInfo?.userInfoLoading);

  const userLeaderBoard = useSelector((state) => state?.userInfo?.userLeaderBoard);

  const table = useTable({
    defaultCurrentPage: 0,
    defaultRowsPerPage: 5,
  });

  useEffect(() => {
    dispatch(Actions.fetchUserLeaderBoard());
  }, []);

  return (
    <Page title="Leader Board | Dashboard">
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="Leader Board" />

        <Divider />
        <br />

        <TablePaginationMaster
          header={[
            {
              id: 'imageUrl',
              type: 'img',
              label: '',
            },
            {
              id: 'name',
              label: 'Name',
              type: 'custom',
              component: (row) => {
                return (
                  <Label variant="light" sx={{ width: 80, justifyContent: 'left' }}>
                    {`${row.firstName} ${row.lastName}`}
                  </Label>
                );
              },
            },
            {
              id: 'email',
              label: 'Email',
              type: 'string',
            },
            {
              id: 'totalScore',
              label: 'Score',
              type: 'number',
            },
            {
              id: 'winContinuous',
              label: 'Steak',
              type: 'number',
            },
          ]}
          filterOption={{ findBy: 'name' }}
          isLoading={userInfoLoading}
          list={userLeaderBoard || []}
          countAllData={userLeaderBoard?.length || 0}
          table={table}
          more={{}}
        />
      </Container>
    </Page>
  );
};

export default LeaderBoardListView;
