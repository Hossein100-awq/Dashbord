import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // نکته مهم: من آدرس /News/Get را حدس زدم.
    // اگر /News/Get هم کار نکرد، در Swagger خودتان دنبال آدرسی بگردید که لیست (List) یا همه (All) را برمی‌گرداند
    // و اینجا جایگزین کنید.
    const externalUrl = 'http://uat-prosha.dayatadbir.com/News/Get';

    const res = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // برای جلوگیری از کش شدن ممکن است این خط را اضافه کنید:
      // cache: 'no-store' 
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'خطا در دریافت اطلاعات از سرور اصلی' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'خطای داخلی سرور' }, { status: 500 });
  }
}