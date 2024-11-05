import { m } from 'framer-motion';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { MotionContainer, varBounce } from 'src/components/animate';
// reduxs
import { useSelector } from 'react-redux';
// utils
import { hasPermission } from '@utils/permission';

// ----------------------------------------------------------------------

export default function PermissionBasedGuard({ children, sx }) {
  const router = useRouter();

  const { uuid, land_uuid, item_uuid, object_uuid } = router.query;

  const [checked, setChecked] = useState(true);

  // Logic here to get current user permission
  const permissions = useSelector((state) => state.userInfo.userData.permissions);

  const check = useCallback(() => {
    let replacedPath = router.asPath;
    if (replacedPath.includes(land_uuid)) {
      replacedPath = replacedPath.replaceAll(land_uuid, ':land_uuid');
    }

    if (replacedPath.includes(uuid)) {
      replacedPath = replacedPath.replaceAll(uuid, ':uuid');
    }

    if (replacedPath.includes(item_uuid)) {
      replacedPath = replacedPath.replaceAll(item_uuid, ':item_uuid');
    }

    if (replacedPath.includes(object_uuid)) {
      replacedPath = replacedPath.replaceAll(object_uuid, ':object_uuid');
    }

    const canAccess = hasPermission(replacedPath, permissions);
    if (!canAccess) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  }, [router, uuid, land_uuid, item_uuid, object_uuid]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof permissions !== 'undefined' && !checked) {
    return (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    );
  }

  return <> {children} </>;
}

PermissionBasedGuard.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
