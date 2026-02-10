"use client";
import React, { useState, useEffect } from "react";
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
  InputLabel,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { getMyProfile, updateMyProfile, getProvinces, getCities } from "./../Hooks/Profile/Prifile";

interface OriginalProfileData {
  birthDate: string;
  email: string;
  city: string;
  province: string;
}

interface OptionItem {
  value: string;
  label: string;
}

const formatShebaNumeric = (value: string) => {
  if (!value) return value;
  let upperValue = value.toUpperCase();
  const prefix = "IR";
  if (upperValue.startsWith(prefix)) {
    upperValue = upperValue.substring(2);
  }
  const digitsOnly = upperValue.replace(/[^0-9]/g, "").substring(0, 24);
  if (digitsOnly.length === 0) return "";
  let formatted = prefix;
  let pos = 0;
  const groups = [2, 4, 4, 4, 4, 4, 4, 4];
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

const schema = yup.object().shape({
  title: yup.string().required("نام و نام خانوادگی را وارد کنید").max(50, "حداکثر 50 کاراکتر"),
  brandTitle: yup.string().required("عنوان تجاری را وارد کنید").max(50, "حداکثر 50 کاراکتر"),
  numberBank: yup
    .string()
    .transform((value: any) => (!value ? "" : value.toString().replace(/[^a-zA-Z0-9]/g, "").toUpperCase()))
    .required("شماره شبا را وارد کنید")
    .matches(/^IR[0-9]{24}$/, "شماره شبا باید با IR شروع شده و دقیقا ۲۴ رقم داشته باشد"),
  number: yup
    .string()
    .transform((value: any) => (!value ? "" : value.toString().replace(/\D/g, "")))
    .required("شماره موبایل را وارد کنید")
    .matches(/^09[0-9]{9}$/, "شماره موبایل باید با 09 شروع شده و 11 رقم باشد")
    .length(11, "شماره موبایل باید 11 رقم باشد"),
  province: yup.string().required("استان را انتخاب کنید"),
  city: yup.string().required("شهر را انتخاب کنید"),
  address: yup.string().required("آدرس را وارد کنید").max(200, "حداکثر 200 کاراکتر"),
});

const ProfileInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
  const [originalProfile, setOriginalProfile] = useState<OriginalProfileData | null>(null);
  const [provinces, setProvinces] = useState<OptionItem[]>([]);
  const [cities, setCities] = useState<OptionItem[]>([]);

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

  const loadCitiesForProvince = async (provinceId: string) => {
    if (!provinceId) {
      setCities([]);
      return;
    }
    try {
      const options = await getCities(provinceId);
      setCities(options);
    } catch (error) {
      console.error("خطا در دریافت لیست شهرها:", error);
      setCities([]);
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      setValue("city", ""); 
      loadCitiesForProvince(selectedProvince);
    } else {
      setCities([]);
      setValue("city", "");
    }
  }, [selectedProvince, setValue]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsPageLoading(true);

      try {
        const provinceOptions = await getProvinces();
        setProvinces(provinceOptions);

        const data = await getMyProfile();
        
        setOriginalProfile({
          birthDate: data.birthDate || new Date().toISOString(),
          email: data.email || "",
          city: data.city || "",
          province: data.province || "",
        });

        const displayName = data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim();
        
        setValue("title", displayName);
        setValue("number", formatIranianMobile(data.phoneNo || ""));
        setValue("numberBank", formatShebaNumeric(data.iban || ""));
        setValue("province", data.province || "");
        setValue("address", data.address || "");
        
        if (data.brandTitle) {
          setValue("brandTitle", data.brandTitle);
        }

        if (data.province) {
          await loadCitiesForProvince(data.province);
          setValue("city", data.city || "");
        }

      } catch (err: any) {
        console.error(err);
        setErrorSnackbar("خطا در دریافت اطلاعات کاربر");
      } finally {
        setIsPageLoading(false);
      }
    };

    loadInitialData();
  }, [setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setErrorSnackbar(null);
    
    if (!originalProfile) {
      setErrorSnackbar("اطلاعات پروفایل کامل بارگذاری نشده است");
      setIsLoading(false);
      return;
    }

    if (!data.city || data.city === "") {
      setErrorSnackbar("لطفا شهر را انتخاب کنید");
      setIsLoading(false);
      return;
    }

    const names = data.title.split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ");
    
    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: originalProfile.email,
      iban: data.numberBank ? data.numberBank.replace(/\s/g, "") : "",
      address: data.address,
      birthDate: originalProfile.birthDate,
      cityId: data.city,
      provinceId: data.province || "",
      postalCode: "",
      brandTitle: data.brandTitle
    };

    try {
      const updatedData = await updateMyProfile(payload);
    
      if (typeof window !== 'undefined') {
        const currentStored = JSON.parse(localStorage.getItem('profileData') || '{}');
        const dataToSave = {
          ...updatedData,
          brandTitle: updatedData.brandTitle || data.brandTitle || currentStored.brandTitle
        };
        localStorage.setItem('profileData', JSON.stringify(dataToSave));
      }
    
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error("Full Error Object:", err);
      let msg = "خطا در ذخیره اطلاعات";
      if (err?.response?.data) {
        const responseData = err.response.data;
        if (responseData.errors && responseData.errors.length > 0) {
          msg = responseData.errors[0].message;
        } else if (responseData.reasons && responseData.reasons.length > 0) {
          msg = responseData.reasons[0].message;
        } else if (responseData.message) {
          msg = responseData.message;
        }
      } else if (err?.message) {
        msg = err.message;
      }
      setErrorSnackbar(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const commonTextFieldSx = {
    direction: "rtl",
    "& .MuiOutlinedInput-root": { "& fieldset": { textAlign: "right" } },
    "& .MuiInputLabel-root": { left: "inherit", right: 28, transformOrigin: "top right" },
    "& .MuiInputLabel-shrink": { transformOrigin: "top right" },
    "& .MuiOutlinedInput-input": { textAlign: "right" },
    "& .MuiFormHelperText-root": { textAlign: "right", mr: 0 },
  };

  const numericInputSx = {
    direction: "rtl",
    "& .MuiOutlinedInput-root": { "& fieldset": { textAlign: "right" } },
    "& .MuiInputLabel-root": { left: "inherit", right: 28, transformOrigin: "top right" },
    "& .MuiInputLabel-shrink": { transformOrigin: "top right" },
    "& .MuiOutlinedInput-input": { textAlign: "right", direction: "ltr", fontFamily: "'Courier New', monospace" },
  };

  if (isPageLoading) {
    return <div className="p-6 text-center">در حال دریافت اطلاعات...</div>;
  }

  return (
    <div className="bg-white rounded-md p-6 w-full" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          پروفایل <PersonIcon />
        </div>
        <div>
          <Link href="./Dashbord">
            <Button
              className="flex gap-1 font-normal text-sm text-gray-500 hover:bg-gray-50"
              sx={{ minWidth: 'auto', borderRadius: 2 }}
            >
              <NavigateNextIcon fontSize="small" style={{ transform: 'rotate(180deg)' }} />
              <span className="hidden sm:inline">بازگشت</span>
            </Button>
          </Link>
        </div>
      </div>
      <hr className="my-4" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label="نام و نام خانوادگی *"
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
                inputProps={{ maxLength: 34 }}
                error={!!error}
                helperText={error?.message}
                sx={{ ...numericInputSx, "& .MuiOutlinedInput-input": { textTransform: "uppercase" } }}
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
                inputProps={{ maxLength: 13 }}
                sx={numericInputSx}
                onChange={(e) => field.onChange(formatIranianMobile(e.target.value))}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <Controller
              name="province"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error} sx={{ direction: "rtl" }}>
                  <InputLabel
                    id="province-label"
                    sx={{
                      left: "inherit",
                      right: 28,
                      transformOrigin: "top right",
                      "&.MuiInputLabel-shrink": { transformOrigin: "top right" },
                    }}
                  >
                    استان *
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="province-label"
                    label="استان *"
                    sx={{ textAlign: "right", "& .MuiSelect-select": { textAlign: "right" } }}
                  >
                    <MenuItem value="" sx={{ justifyContent: "flex-end" }}>
                      <span className="text-gray-400">انتخاب استان</span>
                    </MenuItem>
                    {provinces.map((p) => (
                      <MenuItem key={p.value} value={p.value} sx={{ justifyContent: "flex-end" }}>
                        {p.label}
                      </MenuItem>
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
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error} sx={{ direction: "rtl" }} disabled={!selectedProvince}>
                  <InputLabel
                    id="city-label"
                    sx={{
                      left: "inherit",
                      right: 28,
                      transformOrigin: "top right",
                      "&.MuiInputLabel-shrink": { transformOrigin: "top right" },
                    }}
                  >
                    شهر *
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="city-label"
                    label="شهر *"
                    sx={{ textAlign: "right", "& .MuiSelect-select": { textAlign: "right" } }}
                  >
                    <MenuItem value="" sx={{ justifyContent: "flex-end" }}>
                      <span className="text-gray-400">انتخاب شهر</span>
                    </MenuItem>
                    {cities.map((c) => (
                      <MenuItem key={c.value} value={c.value} sx={{ justifyContent: "flex-end" }}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText sx={{ textAlign: "right" }}>{error.message}</FormHelperText>}
                </FormControl>
              )}
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
        autoHideDuration={6000}
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

export default ProfileInfo;