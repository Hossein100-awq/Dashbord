"use client";
import React from "react";
import Container from "./Container";

import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100 p-6">
      <Container>
        <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-sky-200 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
          <h2 className="text-center text-sky-800 text-2xl font-semibold tracking-tight">
            ثبت نام
          </h2>

          <TextField
            id="first-name"
            label="نام"
            variant="standard"
            fullWidth
            dir="rtl"
            InputLabelProps={{
              sx: {
                right: 0,
                left: "auto",
                transformOrigin: "right",
                textAlign: "right",
                fontSize: 14,
              },
            }}
            inputProps={{
              dir: "rtl",
              style: { textAlign: "right", paddingRight: 6 },
            }}
            required
          />

          <TextField
            id="last-name"
            label="نام خانوادگی"
            variant="standard"
            fullWidth
            dir="rtl"
            InputLabelProps={{
              sx: {
                right: 0,
                left: "auto",
                transformOrigin: "right",
                textAlign: "right",
                fontSize: 14,
              },
            }}
            inputProps={{
              dir: "rtl",
              style: { textAlign: "right", paddingRight: 6 },
            }}
            required
          />

          <div className="flex justify-center mt-2">
            <Link href="./Dashbord">
              {" "}
              <Button
                variant="contained"
                color="success"
                className="w-1/2 rounded-xl py-2 shadow-md"
              >
                ورود
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
