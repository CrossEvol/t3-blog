import { saveData } from "@/app/api/actions/action";
import { NextRequest, NextResponse } from "next/server";

export type Result<T> = {
  status: number;
  message: string;
  data: T;
};

export const POST = async (request: NextRequest) => {
  try {
    const payload = await saveData(await request.formData());

    return NextResponse.json<Result<string>>({
      status: 200,
      message: "File uploaded successfully",
      data: payload,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json<Result<null>>({
      status: 500,
      message: "Failed to upload file",
      data: null,
    });
  }
};
