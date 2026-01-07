"use client";
import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";

// همه چیز مربوط به ProfileService حذف شد

const schema = yup.object().shape({
  title: yup
    .string()
    .required("عنوان را وارد کنید")
    .max(50, "حداکثر 50 کاراکتر"),
  brandTitle: yup
    .string()
    .required("عنوان تجاری را وارد کنید")
    .max(50, "حداکثر 50 کاراکتر"),
  numberBank: yup
    .string()
    .transform((value: any) => {
      if (!value) return "";
      return value
        .toString()
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();
    })
    .required("شماره شبا را وارد کنید")
    .matches(
      /^IR[0-9]{24}$/,
      "شماره شبا باید با IR شروع شده و دقیقا ۲۴ رقم داشته باشد"
    ),
  number: yup
    .string()
    .transform((value: any) => {
      if (!value) return "";
      return value.toString().replace(/\D/g, "");
    })
    .required("شماره موبایل را وارد کنید")
    .matches(/^09[0-9]{9}$/, "شماره موبایل باید با 09 شروع شده و 11 رقم باشد")
    .length(11, "شماره موبایل باید 11 رقم باشد"),
  province: yup.string().required("استان را انتخاب کنید"),
  city: yup.string().required("شهر را انتخاب کنید"),
  address: yup
    .string()
    .required("آدرس را وارد کنید")
    .max(200, "حداکثر 200 کاراکتر"),
});

const PROVINCES: {
  [key: string]: { label: string; cities: { value: string; label: string }[] };
} = {
  tehran: {
    label: "تهران",
    cities: [
      { value: "tehran", label: "تهران" },
      { value: "rey", label: "ری" },
      { value: "shemiranat", label: "شهرستان شمیرانات" },
    ],
  },
  esfahan: {
    label: "اصفهان",
    cities: [
      { value: "esfahan", label: "اصفهان" },
      { value: "kashan", label: "کاشان" },
      { value: "khomeinishahr", label: "خمینی‌شهر" },
    ],
  },
  fars: {
    label: "فارس",
    cities: [
      { value: "shiraz", label: "شیراز" },
      { value: "marvdasht", label: "مرودشت" },
      { value: "jahrm", label: "جهرم" },
    ],
  },
  khorasan_razavi: {
    label: "خراسان رضوی",
    cities: [
      { value: "mashhad", label: "مشهد" },
      { value: "nishapur", label: "نیشابور" },
      { value: "sabzevar", label: "سبزوار" },
    ],
  },
  azarbaijan_east: {
    label: "آذربایجان شرقی",
    cities: [
      { value: "tabriz", label: "تبریز" },
      { value: "maragheh", label: "مراغه" },
      { value: "marand", label: "مرند" },
    ],
  },
};

const ProfileC = () => {
  // حذف useProfile و useUpdateProfile
  // استفاده از useState ساده برای وضعیت لودینگ و خطا
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      brandTitle: "",
      numberBank: "",
      number: "",
      province: "",
      city: "",
      address: "",
    },
  });

  const selectedProvince = watch("province");

  // تغییر: اگر شهر تغییر کند و استان قبلاً انتخاب شده بود، شهر را خالی کن
  // این بخش را با React.useEffect مدیریت نمی‌کنیم چون serverProfile نداریم که بخواهیم پر کنیم
  // اما در رویداد onChange شهر به صورت دستی مدیریت می‌شود.
  
  // برای خالی کردن شهر هنگام تغییر استان، از useEffect استفاده می‌کنیم
  React.useEffect(() => {
    setValue("city", ""); // وقتی استان عوض میشه، شهر خالی بشه
  }, [selectedProvince, setValue]);


  const formatShebaNumeric = (value: string) => {
    if (!value) return value;
    let upperValue = value.toUpperCase();
    const prefix = "IR";
    if (upperValue.startsWith(prefix)) {
      upperValue = upperValue.substring(2);
    }
    const digitsOnly = upperValue.replace(/[^0-9]/g, "").substring(0, 25);
    if (digitsOnly.length === 0) return "";
    let formatted = prefix;
    let pos = 0;
    const groups = [2, 4, 4, 4, 4, 4, 2];
    for (let g of groups) {
      if (pos >= digitsOnly.length) break;
      const part = digitsOnly.substring(pos, pos + g);
      formatted += " " + part;
      pos += g;
    }
    if (pos < digitsOnly.length) {
      formatted += " " + digitsOnly.substring(pos);
    }
    return formatted;
  };

  const formatIranianMobile = (value: string) => {
    if (!value) return value;
    const digits = value.replace(/[^0-9]/g, "").substring(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return digits.slice(0, 4) + " " + digits.slice(4);
    return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorSnackbar(null);

    const payload = {
      ...data,
      numberBank: data.numberBank ? data.numberBank.replace(/\s/g, "") : "",
      number: data.number ? data.number.replace(/\s/g, "") : "",
    };

    try {
      // شبیه‌سازی ارسال به سرور
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Data ready to save:", payload);
      
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error("Full Error Object:", err);
      const msg =
        err?.message ||
        err?.data?.message ||
        (typeof err === "string" ? err : "خطا در ذخیره اطلاعات");
      setErrorSnackbar(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const commonTextFieldSx = {
    direction: "rtl",
    "& .MuiInputLabel-root": {
      right: 30,
      left: "auto",
      transformOrigin: "right top",
      "&.Mui-focused": { right: 30, left: "auto" },
      "&.MuiFormLabel-filled": { right: 30, left: "auto" },
    },
    "& .MuiOutlinedInput-input": {
      textAlign: "right" as const,
    },
    "& .MuiFormHelperText-root": {
      textAlign: "right" as const,
      mr: 0,
    },
  };

  const staticLabelSelectSx = {
    "& .MuiSelect-select": {
      textAlign: "right" as const,
    },
    "& .MuiFormHelperText-root": {
      textAlign: "right" as const,
      mr: 0,
    },
  };

  const numericInputSx = {
    ...commonTextFieldSx,
    "& .MuiOutlinedInput-input": {
      textAlign: "right" as const,
      direction: "ltr" as const,
      fontFamily: "'Courier New', monospace",
    },
  };

  return (
    <div className="bg-white rounded-md p-6 m-4" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          پروفایل <PersonIcon />
        </div>
        <div>
          <Link href="./Dashbord">
            <Button className="flex gap-1" variant="outlined">
              <NavigateNextIcon />
              بازگشت
            </Button>
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="عنوان *"
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                inputProps={{ maxLength: 50 }}
                sx={commonTextFieldSx}
              />
            )}
          />

          <Controller
            name="brandTitle"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="عنوان تجاری *"
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                inputProps={{ maxLength: 50 }}
                sx={commonTextFieldSx}
              />
            )}
          />

          <Controller
            name="numberBank"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="شماره شبا *"
                variant="outlined"
                placeholder="IR 12 3456 7890 1234 5678 9012 34"
                inputProps={{
                  maxLength: 34, 
                }}
                error={!!error}
                helperText={error?.message}
                sx={{
                  ...numericInputSx,
                  "& .MuiOutlinedInput-input": {
                    textTransform: "uppercase",
                  },
                }}
                onChange={(e) => field.onChange(formatShebaNumeric(e.target.value))}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = (e.clipboardData || (window as any).clipboardData).getData("text");
                  field.onChange(formatShebaNumeric(paste));
                }}
              />
            )}
          />

          <Controller
            name="number"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="شماره موبایل *"
                variant="outlined"
                placeholder="09xx xxx xxxx"
                error={!!error}
                helperText={error?.message}
                inputProps={{
                  maxLength: 13,
                }}
                sx={numericInputSx}
                onChange={(e) => field.onChange(formatIranianMobile(e.target.value))}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <Controller
              name="province"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <p className="mb-1 text-sm text-gray-500">استان *</p>

                  <FormControl fullWidth error={!!error} sx={staticLabelSelectSx}>
                    <Select {...field} displayEmpty>
                      <MenuItem value="" disabled>
                        <span className="text-gray-400">انتخاب استان</span>
                      </MenuItem>
                      {Object.entries(PROVINCES).map(([key, info]) => (
                        <MenuItem key={key} value={key}>
                          {info.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                </div>
              )}
            />
          </div>

          <div className="col-span-1">
            <Controller
              name="city"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const cities = selectedProvince ? PROVINCES[selectedProvince]?.cities ?? [] : [];
                return (
                  <div>
                    <p className="mb-1 text-sm text-gray-500">شهر *</p>

                    <FormControl fullWidth error={!!error} sx={staticLabelSelectSx}>
                      <Select {...field} disabled={!selectedProvince} displayEmpty>
                        <MenuItem value="" disabled>
                          <span className="text-gray-400">انتخاب شهر</span>
                        </MenuItem>
                        {cities.map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            {c.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  </div>
                );
              }}
            />
          </div>

          <div className="col-span-2">
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="آدرس *"
                  variant="outlined"
                  error={!!error}
                  helperText={error?.message}
                  inputProps={{ maxLength: 200 }}
                  sx={commonTextFieldSx}
                  multiline
                  rows={2}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
            {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" className="flex items-center gap-4" sx={{ width: "100%" }}>
          ثبت شد
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorSnackbar(null)} severity="error" className="flex items-center gap-4" sx={{ width: "100%" }}>
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileC;