
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/componnets/Feature/Navbar";
import SerchBar from "@/componnets/Feature/SerchBar";
import SideBar from "@/componnets/Feature/SideBar";
import TableCost from "@/componnets/Feature/TableCost";
import ModalAdd, { Cost } from "@/componnets/MUI/Modal/ModalAdd";

const STORAGE_KEY = "cost_rows_v1";


function normalizeText(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim()
    .toLowerCase();
}

function normalizeNumber(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[^0-9]/g, "");
}


function hasLetter(text: string): boolean {
  return /[a-zA-Z\u0600-\u06FF]/.test(text);
}


function hasDigit(text: string): boolean {
  return /\d/.test(text);
}


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

   
    const amountValue = row.isPercent 
      ? Math.round(row.amount * 100) 
      : Math.round(row.amount);
    
    const rowAmountStr = amountValue.toString();
   
    const numberMatch = containsDigit && rowAmountStr.includes(normalizedQueryNumber);

    if (containsDigit && !containsLetter) {
      return numberMatch;
    }

    if (!containsDigit && containsLetter) {
      return textMatch;
    }

    return textMatch || numberMatch;
  });
}

const Page: React.FC = () => {
  const [rows, setRows] = useState<Cost[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Cost> | null>(null);
  const [query, setQuery] = useState<string>("");


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