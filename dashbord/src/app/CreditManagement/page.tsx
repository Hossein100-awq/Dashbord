"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  getCostTypes,
  addCostType,
  updateCostType,
  deleteCostType,
  CostTypeDto
} from "./../../componnets/Hooks/CostType/CostType";

import Navbar from "@/componnets/Feature/Navbar";
import SerchBar from "@/componnets/Feature/SerchBar";
import SideBar from "@/componnets/Feature/SideBar";
import TableCost from "@/componnets/Feature/TableCost";
import ModalAdd, { Cost } from "@/componnets/MUI/Modal/ModalAdd";
import { Snackbar, Alert } from "@mui/material";

const mapApiToUi = (apiItem: CostTypeDto): Cost => ({
  id: apiItem.id,
  title: apiItem.name,
  description: apiItem.description,
  isPercent: apiItem.isPercentage,
  isOptional: apiItem.isOptional,
  amount: apiItem.defaultAmount
});

const mapUiToApi = (uiItem: Cost): any => {
  let finalAmount = 0;
  const rawAmount = uiItem.amount;

  if (typeof rawAmount === 'number') {
    finalAmount = rawAmount;
  } else {
    let str = String(rawAmount || 0);
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(persianDigits[i], 'g'), i.toString());
    }
    str = str.replace(/[^0-9]/g, '');
    finalAmount = parseInt(str, 10) || 0;
  }

  const apiData = {
    id: String(uiItem.id || "0"), 
    name: String(uiItem.title || ""),
    description: String(uiItem.description || ""),
    isPercentage: Boolean(uiItem.isPercent),
    isOptional: Boolean(uiItem.isOptional),
    defaultAmount: finalAmount
  };

  return apiData;
};

function normalizeText(text: string): string { return text.replace(/ي/g, "ی").replace(/ك/g, "ک").trim().toLowerCase(); }
function normalizeNumber(text: string): string { return text.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[^0-9]/g, ""); }
function hasLetter(text: string): boolean { return /[a-zA-Z\u0600-\u06FF]/.test(text); }
function hasDigit(text: string): boolean { return /\d/.test(text); }

function searchCosts(rows: Cost[], query: string): Cost[] {
  const rawQuery = query.trim();
  if (!rawQuery) return rows;
  const normalizedQueryText = normalizeText(rawQuery);
  const normalizedQueryNumber = normalizeNumber(rawQuery);
  const containsDigit = hasDigit(rawQuery);
  const containsLetter = hasLetter(rawQuery);

  return rows.filter((row) => {
    const rowTitle = row.title ? normalizeText(row.title) : "";
    const textMatch = containsLetter && rowTitle.includes(normalizedQueryText);
    const amountValue = row.isPercent ? Math.round(row.amount * 100) : Math.round(row.amount);
    const rowAmountStr = amountValue.toString();
    const numberMatch = containsDigit && rowAmountStr.includes(normalizedQueryNumber);

    if (containsDigit && !containsLetter) return numberMatch;
    if (!containsDigit && containsLetter) return textMatch;
    return textMatch || numberMatch;
  });
}

const Page: React.FC = () => {
  const [rows, setRows] = useState<Cost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Cost> | null>(null);
  const [query, setQuery] = useState<string>("");
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "success" | "error",
  });

  const handleNotify = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchCosts = async () => {
    setLoading(true);
    try {
      const res = await getCostTypes({ Page: 1, Size: 10 });
      if (res.isSuccess && res.value) {
        const uiRows = res.value.data.map(mapApiToUi);
        setRows(uiRows);
      }
    } catch (error) {
      console.error("Error fetching:", error);
      handleNotify("خطا در دریافت اطلاعات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();
  }, []);

  const handleSave = async (data: Cost) => {
    try {
      const apiData = mapUiToApi(data);
      let res;

      if (data.id) {
        res = await updateCostType(apiData);
      } else {
        res = await addCostType(apiData);
      }

      if (res.isSuccess) {
        handleNotify("عملیات با موفقیت انجام شد", "success");
        await fetchCosts();
        setModalOpen(false);
      } else {
        console.error("خطای سرور:", res);
        handleNotify("خطا در ذخیره: " + (res.errors?.[0]?.message || "نامشخص"), "error");
      }
    } catch (error: any) {
      console.error("Error saving:", error);
      if (error.response && error.response.data) {
        console.error("پیام دقیق سرور:", error.response.data);
        handleNotify("جزئیات خطا: " + JSON.stringify(error.response.data), "error");
      } else {
        handleNotify("خطا در ارتباط با سرور", "error");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCostType(id);
      if (res.isSuccess) {
        handleNotify("حذف با موفقیت انجام شد", "success");
        await fetchCosts();
      } else {
        handleNotify("خطا در حذف: " + (res.errors?.[0]?.message || "نامشخص"), "error");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      handleNotify("خطا در ارتباط با سرور", "error");
    }
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (row: Cost) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSearch = (q: string) => setQuery(q || "");

  const filtered = useMemo(() => searchCosts(rows, query), [rows, query]);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <SideBar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2 dark:bg-black transition-colors duration-300 min-h-screen">
            <Navbar />
            <SerchBar onOpenAdd={handleOpenAdd} onSearch={handleSearch} />
            
            {loading ? (
              <div className="p-4 text-center text-gray-500">در حال دریافت اطلاعات...</div>
            ) : (
              <TableCost rows={filtered} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>

      <ModalAdd
        open={modalOpen}
        close={() => setModalOpen(false)}
        save={handleSave}
        initialData={editing ?? null}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Page;