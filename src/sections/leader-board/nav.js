'use client';

import * as Actions from '@actions';
// @mui
import { ConfirmDialog } from '@components/custom-dialog';
import DialogSaveFormComp from '@components/dialog/dialog-save-form';
import Iconify from '@components/iconify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBoolean } from '@hooks/use-boolean';
import CheckIcon from '@mui/icons-material/Check';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { RouterLink } from '@routes/components';
import { paths } from '@routes/paths';
import copy from 'copy-to-clipboard';
import * as moment from 'moment';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// ----------------------------------------------------------------------
const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 35;

const APPBAR_MOBILE = 30;
const APPBAR_DESKTOP = 40;
const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: '3px 0px 5px 0px #888888',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    width: `100%`,
  },
}));
const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  maxHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    maxHeight: APPBAR_DESKTOP,
    // padding: theme.spacing(0, 5),
  },
}));

const FormSchema = Yup.object().shape({
  name: Yup.string().required('name is required'),
});

export default function Nav({ model, preview, setPreview }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const formData = useSelector((state) => state.common.form);
  const SectionsData = useSelector((state) => state.common.sections);
  const ElementsData = useSelector((state) => state.common.elements);
  const formSetting = useSelector((state) => state.common.formSetting);
  const surveyFormCreate = useSelector((state) => state.survey.surveyFormCreate);
  const surveyFormDetail = useSelector((state) => state.survey.surveyFormDetail);
  const surveyFormCopy = useSelector((state) => state.survey.surveyFormCopy);
  const surveyFormDelete = useSelector((state) => state.survey.surveyFormDelete);
  const userData = useSelector((state) => state.userInfo.userData);

  const [Name, setName] = useState(formData.name);
  const [ShowEdit, setShowEdit] = useState(false);
  const [anchorElMore, setAnchorElMore] = useState(null);
  const [anchorElSave, setAnchorElSave] = useState(null);
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const confirmCopyForm = useBoolean(false);
  const confirmDelForm = useBoolean(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FormSchema),
  });

  const openSave = Boolean(anchorElSave);
  const handleClickSave = (event) => {
    setAnchorElSave(event.currentTarget);
  };
  const handleCloseSave = () => {
    setAnchorElSave(null);
  };
  const handleOpenSaveDialog = (formStatus) => {
    handleCloseSave();
    if (model === 'insert') {
      saveForm(formStatus);
    } else {
      updateForm(formStatus);
    }
  };
  const handleCloseSaveDialog = () => {
    setOpenDialogSave(false);
    enqueueSnackbar(`บันทึกแบบสอบถามสำเร็จ`, {
      variant: 'success',
    });
    router.push(paths.dashboard.crm.surveyList);
  };

  const openMore = Boolean(anchorElMore);
  const handleClickMore = (event) => {
    setAnchorElMore(event.currentTarget);
  };
  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  const handleCopyURL = (data) => {
    const linkForm = `${window.location.protocol}//${window.location.host}/forms/${surveyFormDetail.code}`;
    copy(linkForm);
    enqueueSnackbar(`Copy to clipboard`, {
      variant: 'default',
    });
    handleCloseMore();
  };

  const handleCloseDialogCopyForm = () => {
    confirmCopyForm.onFalse();
  };
  const handleSaveCopyForm = (data) => {
    console.log('handleSaveCopyForm :>> ', data);
    dispatch(
      Actions.fetchSurveyFormCopy({
        formUuid: surveyFormDetail.uuid,
        name: data.name,
      }),
    );
  };

  const handleDeleteForm = () => {
    console.log('handleDeleteForm :>> ', surveyFormDetail.uuid);
    dispatch(
      Actions.fetchSurveyFormDelete({
        uuid: surveyFormDetail.uuid,
      }),
    );
    confirmDelForm.onFalse();
  };

  useEffect(() => {
    if (Name)
      dispatch(
        Actions.fetchForm({
          ...formData,
          name: Name,
        }),
      );
  }, [Name]);

  const saveForm = (formStatus) => {
    const formSettingList = [];
    for (const setting of Object.values(formSetting)) {
      if (setting?.data) {
        formSettingList.push(setting);
      }
    }
    dispatch(
      Actions.fetchSurveyFormCreate({
        form: {
          ...formData,
          formStatus,
          createMaker: userData.displayName,
          updateMaker: userData.displayName,
        },
        formSettingList,
        sections: SectionsData,
        elements: ElementsData,
      }),
    );
  };

  const updateForm = (formStatus) => {
    const formSettingList = [];
    for (const setting of Object.values(formSetting)) {
      if (
        setting?.data &&
        setting?.data.indexOf('http://') < 0 &&
        setting?.data.indexOf('https://') < 0
      ) {
        formSettingList.push(setting);
      }
    }
    dispatch(
      Actions.fetchSurveyFormUpdate({
        uuid: formData.uuid,
        data: {
          form: {
            name: formData.name,
            desc: formData.desc,
            isActive: formData.isActive,
            formStatus,
            updateMaker: userData.displayName,
          },
          formSettingNotDelete: true,
          formSettingList,
          sections: SectionsData,
          elements: ElementsData,
        },
      }),
    );
  };

  useEffect(() => {
    if (surveyFormCreate?.uuid) {
      if (surveyFormCreate.formStatus == 'COMPLETE') {
        setOpenDialogSave(true);
      } else {
        enqueueSnackbar(`บันทึกแบบสอบถามสำเร็จ`, {
          variant: 'success',
        });
        router.push(paths.dashboard.crm.surveyList);
      }
    }
  }, [surveyFormCreate]);

  useEffect(() => {
    if (
      surveyFormCopy?.uuid &&
      surveyFormDetail?.uuid &&
      surveyFormCopy?.uuid != surveyFormDetail?.uuid
    ) {
      window.open(paths.dashboard.crm.surveyEdit(surveyFormCopy?.uuid));
    }
  }, [surveyFormCopy]);

  useEffect(() => {
    if (surveyFormDelete.uuid) router.push(paths.dashboard.crm.surveyList);
  }, [surveyFormDelete]);

  const handleSaveDraft = () => {
    if (model === 'insert') {
      const formSettingList = [];
      for (const setting of Object.values(formSetting)) {
        if (setting?.data) {
          formSettingList.push(setting);
        }
      }
      dispatch(
        Actions.fetchSurveyFormCreate({
          form: {
            ...formData,
            name: formData?.name || 'Untitled form',
            formStatus: 'DRAFT',
            createMaker: userData.displayName,
            updateMaker: userData.displayName,
          },
          formSettingList,
          sections: SectionsData,
          elements: ElementsData,
        }),
      );
    }
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            alignContent={'center'}
            gap={1}
          >
            <IconButton
              color="inherit"
              LinkComponent={RouterLink}
              href={paths.dashboard.crm.surveyList}
              onClick={() => handleSaveDraft()}
            >
              <Iconify icon="ion:chevron-back-sharp" />
            </IconButton>
            {ShowEdit ? (
              <TextField
                hiddenLabel
                defaultValue={Name}
                onBlur={() => setShowEdit(false)}
                inputProps={{ style: { fontSize: 18, fontWeight: 700 } }}
                onChange={(e) => setName(e.target.value)}
                variant="filled"
                size="small"
              />
            ) : (
              <h3
                style={{ padding: '.9rem' }}
                // onClick={() => setShowEdit(true)}
              >
                {formData.name || 'ชื่อแบบสอบถาม'}
              </h3>
            )}
          </Stack>
        </Box>

        {surveyFormDetail?.updatedAt && (
          <Box>
            <Stack direction="row" alignItems="center">
              <CheckIcon color="success" />
              <Typography variant="body2">
                บันทึกล่าสุด {moment(surveyFormDetail.updatedAt).format('DD MMM YYYY HH:mm')}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'transparent',
              color: 'text.primary',
              borderRadius: 1,
              p: 3,
            }}
          >
            <Stack direction="row" gap={1}>
              <Button variant="outlined" onClick={() => setPreview((state) => !state)}>
                {!preview ? 'ดูตัวอย่าง' : 'กลับไปแก้ไข'}
              </Button>
              <Button variant="contained" color="primary" onClick={handleClickSave}>
                บันทึก
              </Button>
              {/*  */}
              <Menu anchorEl={anchorElSave} open={openSave} onClose={handleCloseSave}>
                <MenuItem onClick={() => handleOpenSaveDialog('DRAFT')}>บันทึกร่าง</MenuItem>
                <MenuItem onClick={() => handleOpenSaveDialog('COMPLETE')}>
                  บันทึกแบบพร้อมใช้งาน
                </MenuItem>
              </Menu>
              {/*  */}
              <Button
                variant="contained"
                color="primary"
                sx={{ minWidth: 20 }}
                disabled={model == 'insert'}
                onClick={handleClickMore}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </Button>
              {/*  */}
              <Menu anchorEl={anchorElMore} open={openMore} onClose={handleCloseMore}>
                <MenuItem
                  onClick={() => {
                    confirmCopyForm.onTrue();
                    handleCloseMore();
                  }}
                >
                  ทำสำเนา
                </MenuItem>
                <MenuItem onClick={handleCopyURL}>คัดลอก URL</MenuItem>
                <MenuItem
                  onClick={() => {
                    confirmDelForm.onTrue();
                    handleCloseMore();
                  }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" /> ลบ
                </MenuItem>
              </Menu>
              {/*  */}
            </Stack>
          </Box>
        </Stack>
      </ToolbarStyle>

      {/* Dialog Save Active */}
      <DialogSaveFormComp
        open={openDialogSave}
        onClose={handleCloseSaveDialog}
        formData={surveyFormCreate}
      />
      {/* Dialog Copy Form */}
      <ConfirmDialog
        open={confirmCopyForm.value}
        txtClose="ยกเลิก"
        onClose={handleCloseDialogCopyForm}
        title={`คัดลอกฟอร์ม "${surveyFormDetail?.name}"`}
        content={
          <>
            <TextField
              {...register(`name`)}
              error={errors?.name}
              sx={{ mt: 1 }}
              label="ชื่อฟอร์ม"
              fullWidth
              inputProps={{ maxLength: 64 }}
            />
          </>
        }
        action={
          <Button variant="contained" color="primary" onClick={handleSubmit(handleSaveCopyForm)}>
            บันทึก
          </Button>
        }
      />
      {/* Dialog Delete Form */}
      <ConfirmDialog
        style="error"
        open={confirmDelForm.value}
        onClose={() => {
          confirmDelForm.onFalse();
        }}
        title={'ลบแบบสอบถาม ?'}
        content={
          <Typography>{`${
            surveyFormDetail?.isActive ? 'แบบสอบถามนี้กำลังถูกใช้งาน ' : ''
          }ต้องการลบแบบสอบถาม ${surveyFormDetail?.name} หรือไม่`}</Typography>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteForm();
            }}
          >
            ลบ
          </Button>
        }
      />
    </RootStyle>
  );
}
