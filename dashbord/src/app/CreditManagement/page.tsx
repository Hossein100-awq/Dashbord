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

  console.log("⬅️ داده ارسالی به سرور:", JSON.stringify(apiData, null, 2));
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
        console.log(`در حال ویرایش رکورد با ID: ${data.id}`);
        res = await updateCostType(apiData);
      } else {
        console.log("در حال ایجاد رکورد جدید");
        res = await addCostType(apiData);
      }

      if (res.isSuccess) {
        await fetchCosts();
        setModalOpen(false);
      } else {
        console.error("خطای سرور:", res);
        alert("خطا در ذخیره: " + (res.errors?.[0]?.message || "نامشخص"));
      }
    } catch (error: any) {
      console.error("Error saving:", error);
      
      if (error.response && error.response.data) {
        console.error("پیام دقیق سرور:", error.response.data);
        alert("جزئیات خطا: " + JSON.stringify(error.response.data));
      } else {
        alert("خطا در ارتباط با سرور");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCostType(id);
      if (res.isSuccess) {
        await fetchCosts();
      } else {
        alert("خطا در حذف: " + (res.errors?.[0]?.message || "نامشخص"));
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("خطا در ارتباط با سرور");
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
    <div className="flex min-h-screen bg-slate-100">
      <SideBar />
      <div className="mx-auto w-full max-w-5xl px-4">
        <Navbar />
        <SerchBar onOpenAdd={handleOpenAdd} onSearch={handleSearch} />
        
        {loading ? (
          <div className="p-4 text-center text-gray-500">در حال دریافت اطلاعات...</div>
        ) : (
          <TableCost rows={filtered} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>

      <ModalAdd
        open={modalOpen}
        close={() => setModalOpen(false)}
        save={handleSave}
        initialData={editing ?? null}
      />
    </div>
  );
};

export default Page;