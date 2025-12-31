// src/components/US/TableCost.tsx
"use client";

import React, { useState } from "react";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AddchartIcon from "@mui/icons-material/Addchart";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Paper from "@mui/material/Paper";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import type { Cost } from "@/componnets/MUI/Modal/ModalAdd";

interface Props {
  rows: Cost[];
  onDelete: (id: number) => void;
  onEdit?: (row: Cost) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "right",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "right",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableCost: React.FC<Props> = ({ rows, onDelete, onEdit }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedId !== null) onDelete(selectedId);
    setOpenDelete(false);
    setSelectedId(null);
  };

  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <DehazeIcon />
          لیست انواع هزینه‌ها
        </div>
        <AddchartIcon className="text-gray-500" />
      </div>

      <TableContainer component={Paper}>
        <Table dir="rtl" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>عنوان</StyledTableCell>
              <StyledTableCell>درصدی می‌باشد؟</StyledTableCell>
              <StyledTableCell>اختیاری می‌باشد؟</StyledTableCell>
              <StyledTableCell>مبلغ / مقدار پیش‌فرض</StyledTableCell>
              <StyledTableCell>عملیات</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" className="text-gray-500 py-4">
                  موردی یافت نشد
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.title}
                  </StyledTableCell>
                  <StyledTableCell>{row.isPercent ? "بله" : "خیر"}</StyledTableCell>
                  <StyledTableCell>{row.isOptional ? "بله" : "خیر"}</StyledTableCell>
                  <StyledTableCell>
                    {row.isPercent
                      ? `${Math.round(row.amount * 100).toLocaleString("fa-IR")} %`
                      : `${Math.round(row.amount).toLocaleString("fa-IR")} ریال`}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                      <Tooltip title="حذف">
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ویرایش">
                        <IconButton size="small" onClick={() => onEdit?.(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} dir="rtl">
        <DialogTitle>حذف مورد</DialogTitle>
        <DialogContent>
          <Typography>آیا از حذف این ردیف مطمئن هستید؟</Typography>
        </DialogContent>
        <DialogActions className="flex gap-4" sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setOpenDelete(false)}>
            انصراف
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableCost;