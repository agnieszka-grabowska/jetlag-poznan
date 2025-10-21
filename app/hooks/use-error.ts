"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export function useError(error: any) {
  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message);
    } else if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);
}
