import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "No files provided" },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Something went wrong uploading files: ${err}` },
      { status: 500 },
    );
  }
}
