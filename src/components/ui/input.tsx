import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: any
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    // Convert value to string if it's a Date object and type is datetime-local
    const formattedValue = type === 'datetime-local' && value instanceof Date ? value.toISOString().slice(0, 16) : value;

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={formattedValue} // Use the formattedValue instead of directly using value
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

// import * as React from "react"

// import { cn } from "@/lib/utils"

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Input.displayName = "Input"

// export { Input }
