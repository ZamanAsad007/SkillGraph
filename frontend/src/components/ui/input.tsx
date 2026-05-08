import type * as React from "react";
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "h-9 w-full rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#17202a] outline-none transition placeholder:text-[#8c97a8] focus:border-[#0c66e4] focus:ring-2 focus:ring-[#0c66e4]/15 disabled:cursor-not-allowed disabled:bg-[#f7f8fa]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
