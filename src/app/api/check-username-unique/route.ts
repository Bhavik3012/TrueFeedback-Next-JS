import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { success, z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { message } from "@/schemas/message";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  // localhost:3000/api/cuu?username=bhavik?phone=android
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is unique.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
