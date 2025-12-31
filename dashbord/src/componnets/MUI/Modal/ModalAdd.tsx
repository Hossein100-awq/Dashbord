// "use client";
import React, { useEffect, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, Fade } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import EditIcon from "@mui/icons-material/Edit";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  cost: yup
    .string()
    .required("عنوان هزینه را وارد کنید")
    .matches(
      /^[\u0600-\u06FF\s0-9a-zA-Z]+$/,
      "فقط اعداد، حروف فارسی و انگلیسی مجاز است"
    ),
  defaultAmount: yup
    .string()
    .when(["isOptional", "isPercent"], ([isOptional, isPercent], schema) => {
      if (isOptional === "no") {
        const msg =
          isPercent === "yes"
            ? "درصد پیش‌فرض را وارد کنید"
            : "مبلغ پیش‌فرض را وارد کنید";
        return schema.required(msg).matches(/^\d+$/, "فقط عدد وارد کنید");
      } else {
        return schema.matches(/^\d*$/, "فقط عدد وارد کنید"); // optional, but if entered, digits only
      }
    }),
  explain: yup.string().max(200, "حداکثر 200 کاراکتر"),
  isPercent: yup.string(),
  isOptional: yup.string(),
});

export type Cost = {
  id: number;
  title: string;
  amount: number;
  isPercent: boolean;
  isOptional: boolean;
  description?: string;
};

interface ModalT {
  open: boolean;
  close: () => void;
  save: (data: Cost) => void;
  initialData?: Partial<Cost> | null;
}

const ModalAdd: React.FC<ModalT> = ({
  open,
  close,
  save,
  initialData = null,
}) => {
  const snapshotRef = useRef({
    cost: "",
    defaultAmount: "",
    explain: "",
    isPercent: "no",
    isOptional: "no",
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      cost: "",
      defaultAmount: "",
      explain: "",
      isPercent: "no",
      isOptional: "no",
    },
  });

  const isPercentValue = watch("isPercent");

  useEffect(() => {
    if (!open) return;

    const init = {
      cost: initialData?.title ?? "",
      defaultAmount:
        initialData?.amount !== undefined && initialData?.amount !== null
          ? String(
              initialData.isPercent
                ? Math.round(initialData.amount * 100)
                : initialData.amount
            )
          : "",
      explain: initialData?.description ?? "",
      isPercent: initialData?.isPercent ? "yes" : "no",
      isOptional: initialData?.isOptional ? "yes" : "no",
    };

    reset(init);

    snapshotRef.current = init;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(initialData), reset]);

  const onSubmit = (data: any) => {
    let amount = data.defaultAmount.trim()
      ? Number(data.defaultAmount.replace(/[^0-9.-]+/g, ""))
      : 0;
    if (data.isPercent === "yes") {
      amount = amount / 100; // به عنوان درصد در نظر بگیر (مثلاً 10 → 0.1)
    }
    const item: Cost = {
      id: initialData?.id ?? Date.now(),
      title: data.cost.trim() || "بدون عنوان",
      amount,
      isPercent: data.isPercent === "yes",
      isOptional: data.isOptional === "yes",
      description: data.explain.trim(),
    };
    save(item);
    close();
  };

  const handleReset = () => {
    reset(snapshotRef.current);
  };

  // تشخیص حالت ویرایش یا افزودن
  const isEdit = !!(
    initialData &&
    initialData.id !== undefined &&
    initialData.id !== null
  );
  const submitLabel = isEdit ? "ویرایش" : "ثبت";
  const submitIcon = isEdit ? <EditIcon /> : <AddBoxIcon />;

  return (
    <Modal
      open={open}
      onClose={close}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
          sx: { backgroundColor: "rgba(0,0,0,0.55)" },
        },
      }}
    >
      <Fade in={open}>
        <Box
          dir="rtl"
          sx={(theme) => ({
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 720,
            bgcolor: theme.palette.mode === "dark" ? "#111" : "#fff",
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
            p: 3,
            textAlign: "right",
          })}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <Typography variant="h6" align="right">
              {isEdit ? "ویرایش هزینه" : "افزودن هزینه"}
            </Typography>
          </Box>
          <hr className="mb-5" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <div className="flex" style={{ width: "100%" }}>
                <div style={{ flex: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="cost"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="عنوان هزینه *"
                          size="small"
                          error={!!error}
                          helperText={error?.message}
                          InputLabelProps={{
                            shrink: true,
                            sx: { right: 8, left: "auto", textAlign: "right" },
                          }}
                          inputProps={{
                            dir: "rtl",
                            style: { textAlign: "right", paddingRight: 10 },
                          }}
                          FormHelperTextProps={{
                            sx: { textAlign: "right" },
                          }}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />
                  </Grid>
                </div>

                <div className="mr-6 mb-3.5" style={{ marginLeft: 16 }}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        alignItems: "center",
                        flexWrap: "wrap",
                        textAlign: "right",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          sx={{
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            pr: 1.5,
                          }}
                        >
                          درصدی می‌باشد:
                        </Typography>
                        <Controller
                          name="isPercent"
                          control={control}
                          render={({ field }) => (
                            <FormControl>
                              <RadioGroup row {...field}>
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio size="small" />}
                                  label="بله"
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio size="small" />}
                                  label="خیر"
                                />
                              </RadioGroup>
                            </FormControl>
                          )}
                        />
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          sx={{
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            pr: 1.5,
                          }}
                        >
                          اختیاری می‌باشد:
                        </Typography>
                        <Controller
                          name="isOptional"
                          control={control}
                          render={({ field }) => (
                            <FormControl>
                              <RadioGroup row {...field}>
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio size="small" />}
                                  label="بله"
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio size="small" />}
                                  label="خیر"
                                />
                              </RadioGroup>
                            </FormControl>
                          )}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </div>
              </div>
            </Grid>

            <Box mt={3}>
              <div className="flex gap-14">
                <Controller
                  name="defaultAmount"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      onChange={(e) => {
                        // فقط عدد اجازه بده (حروف رو فیلتر کن)
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        field.onChange(value);
                      }}
                      label={
                        isPercentValue === "yes"
                          ? "درصد پیش فرض *"
                          : "مبلغ پیش فرض *"
                      }
                      placeholder={isPercentValue === "yes" ? "%" : "ریال"}
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                      InputLabelProps={{
                        shrink: true,
                        sx: { right: 8, left: "auto", textAlign: "right" },
                      }}
                      inputProps={{
                        dir: "rtl",
                        style: { textAlign: "right", paddingRight: 10 },
                        inputMode: "numeric", // کیبورد عددی نشون بده
                        pattern: "[0-9]*", // برای HTML validation
                      }}
                      FormHelperTextProps={{
                        sx: { textAlign: "right" },
                      }}
                    />
                  )}
                />
                <Controller
                  name="explain"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="توضیحات"
                      multiline
                      minRows={3}
                      size="small"
                      error={!!error}
                      helperText={error?.message}
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          left: "auto",
                          // مقدار right را برای جابه‌جایی به چپ افزایش بده
                          right: { xs: "12px", sm: "20px", md: "36px" },
                          transformOrigin: "right",
                          // وقتی label shrink شود، باز هم همون فاصله رعایت شود
                          "&.MuiInputLabel-shrink": {
                            right: { xs: "9px", sm: "17px", md: "33px" },
                          },
                        },
                      }}
                      inputProps={{
                        dir: "rtl",
                        style: { textAlign: "right", paddingRight: 18 },
                        maxLength: 200,
                      }}
                      FormHelperTextProps={{
                        sx: { textAlign: "right" },
                      }}
                    />
                  )}
                />
              </div>
            </Box>

            <div
              className="flex gap-3.5 justify-end mt-6"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 14,
                marginTop: 24,
              }}
            >
              <Button
                type="submit" // برای submit فرم
                className="flex gap-1.5"
                variant="contained"
                disabled={isSubmitting}
              >
                {submitIcon}
                {submitLabel}
              </Button>
              <Button
                className="flex gap-1.5"
                variant="contained"
                onClick={handleReset}
              >
                <AssignmentAddIcon />
                بازنشانی
              </Button>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalAdd;
