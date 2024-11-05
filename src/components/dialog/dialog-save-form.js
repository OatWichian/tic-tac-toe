import LinkIcon from '@mui/icons-material/Link';
import { Button, Link, Stack, Switch, TextField, Typography } from '@mui/material';
import * as _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import DialogLayoutComp from './dialog-layout';
import * as Actions from '@actions';
import { useDispatch, useSelector } from 'react-redux';
import copy from 'copy-to-clipboard';
import FormSettingConst from '@utils/constants/form-setting-const';
import { useSnackbar } from 'notistack';

const DialogSaveFormComp = ({ open, onClose, formData }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const surveyFormUpdate = useSelector((state) => state.survey.surveyFormUpdate);

  const [formActive, setformActive] = useState(false);
  const [txtInactive, setTxtInactive] = useState('');

  const setTxtInactiveData = useCallback(
    _.debounce(function (data) {
      setTxtInactive(data);
    }, 1000),
    [],
  );

  const handelSave = () => {
    dispatch(
      Actions.fetchSurveyFormUpdate({
        uuid: formData.uuid,
        data: {
          form: {
            ...formData,
            isActive: formActive,
          },
          formSettingNotDelete: true,
          formSettingList: !formActive
            ? [
                {
                  type: FormSettingConst.TXT_INACTIVE,
                  data: txtInactive,
                },
              ]
            : [],
        },
      }),
    );
  };

  const linkForm = `${window.location.protocol}//${window.location.host}/forms/${formData.code}`;
  const handelCopyLink = () => {
    copy(linkForm);
    enqueueSnackbar(`Copy to clipboard`, {
      variant: 'default',
    });
  };

  useEffect(() => {
    if (surveyFormUpdate.uuid) {
      onClose();
    }
  }, [surveyFormUpdate]);

  return (
    <DialogLayoutComp open={open} title="บันทึกแบบสอบถาม">
      <Typography>ลิงค์</Typography>
      <Stack direction="row" alignItems="center" gap={1}>
        <Link variant="body2" id="form-link">
          {linkForm}
        </Link>
        <Button
          variant="contained"
          sx={(theme) => ({
            color: 'primary.main',
            bgcolor: theme.palette.grey[200],
            ':hover': {
              bgcolor: theme.palette.grey[300],
            },
          })}
          startIcon={<LinkIcon sx={{ transform: 'rotate(-45deg)' }} />}
          onClick={handelCopyLink}
        >
          คัดลอกลิงค์
        </Button>
      </Stack>
      <br />

      <Typography>เปิดรับคำตอบ</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2">ปิด</Typography>
        <Switch checked={formActive} onChange={() => setformActive((state) => !state)} />
        <Typography variant="body2">เปิด</Typography>
      </Stack>
      <br />

      {!formActive && (
        <>
          <Typography>ข้อความแบบสอบถามที่ปิดแล้ว</Typography>
          <TextField
            placeholder="แบบสอบถามถูกปิดแล้ว"
            fullWidth
            onChange={(e) => setTxtInactiveData(e.target.value)}
          />
          <br />
          <br />
        </>
      )}

      <Stack direction="row" gap={1} justifyContent="end">
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button variant="contained" color="primary" onClick={handelSave}>
          บันทึก
        </Button>
      </Stack>
    </DialogLayoutComp>
  );
};

export default DialogSaveFormComp;
