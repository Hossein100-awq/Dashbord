"use client";
import React, { useEffect, useRef, useState } from "react"; // useState اضافه شد
import PersonIcon from "@mui/icons-material/Person";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "next/link";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";

// کلید ذخیره‌سازی
const STORAGE_KEY = "profile_data_v1";

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
      return value.toString().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    })
    .required("شماره شبا را وارد کنید")
    // اصلاح: 24 رقم بعد از IR
    .matches(
      /^IR[0-9]{24}$/,
      "شماره شبا باید با IR شروع شده و ۲۴ رقم داشته باشد (مجموع ۲۶ کاراکتر)"
    ),
  number: yup
    .string()
    // حذف فاصله‌ها قبل از ولیدیشن برای اجازه دادن به اعداد فرمت شده
    .transform((value: any) => {
      if (!value) return "";
      return value.toString().replace(/\D/g, "");
    })
    .required("شماره موبایل را وارد کنید")
    // اصلاح: {9} به معنای 9 رقم دیگر به جز 09 است (جمعا 11 رقم)
    .matches(/^09[0-9]{9}$/, "شماره موبایل باید با 09 شروع شده و 11 رقم باشد")
    .length(11, "شماره موبایل باید 11 رقم باشد"),
  province: yup.string().required("استان را انتخاب کنید"),
  city: yup.string().required("شهر را انتخاب کنید"),
  address: yup
    .string()
    .required("آدرس را وارد کنید")
    .max(200, "حداکثر 200 کاراکتر"),
});

const PROVINCES: { [key: string]: { label: string; cities: { value: string; label: string }[] } } = {
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
  const isMounted = useRef(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // استیت نوتیفیکیشن

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  useEffect(() => {
    if (isMounted.current) {
      setValue("city", "");
    }
  }, [selectedProvince, setValue]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const formattedData = {
          ...parsedData,
          numberBank: formatShebaNumeric(parsedData.numberBank || ''),
          number: formatIranianMobile(parsedData.number || ''),
        };
        reset(formattedData);
      } catch (e) {
        console.error("خطا در خواندن اطلاعات پروفایل", e);
      }
    }
    isMounted.current = true;
  }, [reset]);

  const formatShebaNumeric = (value: string) => {
    if (!value) return value;
    let upperValue = value.toUpperCase();
    const prefix = 'IR';
    if (upperValue.startsWith(prefix)) {
      upperValue = upperValue.substring(2);
    }
    const digitsOnly = upperValue.replace(/[^0-9]/g, '').substring(0, 24);
    if (digitsOnly.length === 0) return '';
    let formatted = prefix;
    let pos = 0;
    const groups = [2, 4, 4, 4, 4, 4, 2];
    for (let g of groups) {
      if (pos >= digitsOnly.length) break;
      const part = digitsOnly.substring(pos, pos + g);
      formatted += ' ' + part;
      pos += g;
    }
    return formatted;
  };

  const formatIranianMobile = (value: string) => {
    if (!value) return value;
    const digits = value.replace(/[^0-9]/g, "").substring(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return digits.slice(0,4) + " " + digits.slice(4);
    return digits.slice(0,4) + " " + digits.slice(4,7) + " " + digits.slice(7);
  };

  const onSubmit = (data: any) => {
    if (data.numberBank) {
      data.numberBank = data.numberBank.replace(/\s/g, '');
    }
    if (data.number) {
      data.number = data.number.replace(/\s/g, '');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Data submitted:", data);
    setSnackbarOpen(true); // باز کردن نوتیفیکیشن
  };

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& input": {
        textAlign: "right",
        direction: "rtl",
        paddingRight: "14px",
        fontFamily: "'Courier New', monospace",
      },
      "& input::placeholder": {
        opacity: 0.7,
        fontSize: "0.875rem",
        textAlign: "right",
        direction: "rtl",
        fontFamily: "'Courier New', monospace",
      },
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
                InputLabelProps={{ shrink: true, style: { right: 20, left: "auto" } }}
                sx={commonTextFieldStyles}
                FormHelperTextProps={{ sx: { textAlign: "right" } }}
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
                InputLabelProps={{ shrink: true, style: { right: 20, left: "auto" } }}
                sx={commonTextFieldStyles}
                FormHelperTextProps={{ sx: { textAlign: "right" } }}
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
                  maxLength: 33,
                  style: { fontFamily: "'Courier New', monospace", letterSpacing: "0.5px", direction: "ltr" }
                }}
                InputLabelProps={{ shrink: true, style: { right: 20, left: "auto" } }}
                sx={{
                  ...commonTextFieldStyles,
                  "& .MuiOutlinedInput-root": {
                    "& input": { textTransform: "uppercase", direction: "ltr" },
                    "& input::placeholder": { fontFamily: "'Courier New', monospace", letterSpacing: "0.5px", opacity: 0.7, direction: "ltr" }
                  },
                }}
                error={!!error}
                helperText={error?.message}
                onChange={(e) => field.onChange(formatShebaNumeric(e.target.value))}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = (e.clipboardData || (window as any).clipboardData).getData('text');
                  field.onChange(formatShebaNumeric(paste));
                }}
                FormHelperTextProps={{ sx: { textAlign: "right" } }}
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
                  // تغییر جهت به ltr برای جلوگیری از پرش کرسر
                  style: { fontFamily: "'Courier New', monospace", direction: "ltr", textAlign: "right" }
                }} 
                InputLabelProps={{ shrink: true, style: { right: 20, left: "auto" } }}
                sx={{
                  ...commonTextFieldStyles,
                  "& .MuiOutlinedInput-root": {
                    // تغییر جهت ورودی برای جلوگیری از پرش کرسر هنگام تایپ
                    "& input": { direction: "ltr", textAlign: "right" },
                    "& input::placeholder": { direction: "ltr", opacity: 0.7 }
                  },
                }}
                onChange={(e) => field.onChange(formatIranianMobile(e.target.value))}
                FormHelperTextProps={{ sx: { textAlign: "right" } }}
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
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="province-label" sx={{ right: 20, left: "auto", backgroundColor: "white", padding: "0 8px", transform: "translate(0, -9px) scale(0.75)" }}>
                    استان *
                  </InputLabel>
                  <Select {...field} labelId="province-label" sx={{ "& .MuiSelect-select": { textAlign: "right", direction: "rtl", paddingRight: "14px" } }}>
                    {Object.entries(PROVINCES).map(([key, info]) => (
                      <MenuItem key={key} value={key}>{info.label}</MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText sx={{ textAlign: "right" }}>{error.message}</FormHelperText>}
                </FormControl>
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
                  <FormControl fullWidth error={!!error}>
                    <InputLabel id="city-label" sx={{ right: 20, left: "auto", backgroundColor: "white", padding: "0 8px", transform: "translate(0, -9px) scale(0.75)" }}>
                      شهر *
                    </InputLabel>
                    <Select {...field} labelId="city-label" disabled={!selectedProvince} sx={{ "& .MuiSelect-select": { textAlign: "right", direction: "rtl", paddingRight: "14px" } }}>
                      {cities.map((c) => (<MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>))}
                    </Select>
                    {error && <FormHelperText sx={{ textAlign: "right" }}>{error.message}</FormHelperText>}
                  </FormControl>
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
                  InputLabelProps={{ shrink: true, style: { right: 16, left: "auto" } }}
                  sx={{ ...commonTextFieldStyles, "& .MuiOutlinedInput-root": { "& textarea": { textAlign: "right", direction: "rtl", paddingRight: "14px" } } }}
                  multiline
                  rows={2}
                  FormHelperTextProps={{ sx: { textAlign: "right" } }}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            ذخیره تغییرات
          </Button>
        </div>
      </form>

      {/* --- نوتیفیکیشن ثبت شد --- */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          className="flex items-center gap-4" // افزودن فاصله بین آیکون و متن
          sx={{ width: '100%' }}
        >
          ثبت شد
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProfileC;