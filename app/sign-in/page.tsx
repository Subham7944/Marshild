import { SignIn } from "@clerk/nextjs";
import React from "react";
import { useSearchParams } from "next/navigation";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <SignIn redirectUrl={redirectUrl || "/dashboard"} signUpUrl="/sign-up" />
      </div>
    </div>
  );
};

export default Page;
