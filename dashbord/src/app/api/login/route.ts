// src/app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    
    const businessKey = "1da5ce01-7491-44a2-a823-2f4734ef0aef";

    const response = await fetch(
      "http://uat-prosha.dayatadbir.com/auth/Auth/LoginWithPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "BusinessKey": businessKey, 
        },
       
        body: JSON.stringify({ username, password }),
      }
    );

    if (!response.ok) {
      
      const errorText = await response.text();
      return NextResponse.json(
        { message: errorText || "Login failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

  
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}