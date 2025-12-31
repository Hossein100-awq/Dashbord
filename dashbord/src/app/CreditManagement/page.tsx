// src/app/Dashbord/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/componnets/US/Navbar";
import SerchBar from "@/componnets/US/SerchBar";
import SideBar from "@/componnets/US/SideBar";
import TableCost from "@/componnets/US/TableCost";
import ModalAdd, { Cost } from "@/componnets/MUI/Modal/ModalAdd";

const STORAGE_KEY = "cost_rows_v1";

/**
 * توابع کمکی برای پردازش ورودی جستجو
 */

// تبدیل حروف عربی (ی و ک) به فارسی و کوچک کردن حروف برای تطبیق بهتر
function normalizeText(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim()
    .toLowerCase();
}

// تبدیل اعداد فارسی به انگلیسی و حذف تمام کاراکترهای غیر عددی
function normalizeNumber(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[^0-9]/g, "");
}

// بررسی وجود حروف
function hasLetter(text: string): boolean {
  return /[a-zA-Z\u0600-\u06FF]/.test(text);
}

// بررسی وجود عدد
function hasDigit(text: string): boolean {
  return /\d/.test(text);
}

/**
 * تابع اصلی جستجو
 */
function searchCosts(rows: Cost[], query: string): Cost[] {
  const rawQuery = query.trim();
  if (!rawQuery) return rows;

  const normalizedQueryText = normalizeText(rawQuery);
  const normalizedQueryNumber = normalizeNumber(rawQuery);

  const containsDigit = hasDigit(rawQuery);
  const containsLetter = hasLetter(rawQuery);

  return rows.filter((row) => {
    // 1. منطق تطابق متن
    const rowTitle = row.title ? normalizeText(row.title) : "";
    const textMatch = containsLetter && rowTitle.includes(normalizedQueryText);

    // 2. منطق تطابق عدد
    // برای تطابق، عدد ردیف را به رشته تبدیل می‌کنیم
    // اگر درصد است در 100 ضرب می‌کنیم تا با چیزی که کاربر می‌بیند (مثلا 15%) یکسان شود
    const amountValue = row.isPercent 
      ? Math.round(row.amount * 100) 
      : Math.round(row.amount);
    
    const rowAmountStr = amountValue.toString();
    // اگر کوئری عددی باشد و در مبلغ وجود داشته باشد
    const numberMatch = containsDigit && rowAmountStr.includes(normalizedQueryNumber);

    // 3. تصمیم‌گیری نهایی
    
    // اگر فقط عدد وارد شده -> فقط در مبلغ جستجو کن
    if (containsDigit && !containsLetter) {
      return numberMatch;
    }

    // اگر فقط متن وارد شده -> فقط در عنوان جستجو کن
    if (!containsDigit && containsLetter) {
      return textMatch;
    }

    // اگر مخلوط وارد شده (مثلاً "هزینه 100") -> هر کدام که بود را قبول کن
    return textMatch || numberMatch;
  });
}

const Page: React.FC = () => {
  const [rows, setRows] = useState<Cost[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Cost> | null>(null);
  const [query, setQuery] = useState<string>("");

  // بارگذاری داده‌ها از localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Cost[];
        setRows(parsed);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.warn("failed to read saved costs", err);
      setRows([]);
    }
  }, []);

  // ذخیره داده‌ها در localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (err) {
      console.warn("failed to save costs", err);
    }
  }, [rows]);

  const handleOpenAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSave = (data: Cost) => {
    setRows((prev) => {
      const exists = prev.some((r) => r.id === data.id);
      if (exists) {
        return prev.map((r) => (r.id === data.id ? data : r));
      }
      return [data, ...prev];
    });
  };

  const handleEdit = (row: Cost) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSearch = (q: string) => {
    setQuery(q || "");
  };

  // فیلتر کردن داده‌ها بر اساس جستجو
  const filtered = useMemo(() => {
    return searchCosts(rows, query);
  }, [rows, query]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SideBar />
      <div className="mx-auto w-full max-w-5xl px-4">
        <Navbar />
        <SerchBar onOpenAdd={handleOpenAdd} onSearch={handleSearch} />
        <TableCost rows={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <ModalAdd
        open={modalOpen}
        close={() => setModalOpen(false)}
        save={(data) => {
          handleSave(data);
          setModalOpen(false);
        }}
        initialData={editing ?? null}
      />
    </div>
  );
};

export default Page;