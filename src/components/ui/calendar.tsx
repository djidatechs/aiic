"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, StyledElement } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { fr, enUS , arDZ } from 'date-fns/locale';
import { useLocale } from '../hooks/local';


export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface CustomClassNames {
  filled: string;
  maybeFilled: string;
  allowed: string;
  allowed_online:string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  filled_days = [],
  maybe_filled_days = [],
  allowed_days = [],
  // allowed_days_online = [],
  selectedDay,
  ...props
}: CalendarProps & {
  filled_days: Date[];
  maybe_filled_days: Date[];
  allowed_days: Date[];
  // allowed_days_online: Date[];
  selectedDay : Date|undefined;
}) {
  const today = new Date();
  const local = useLocale()

  const local_format = {
    ar: arDZ,
    fr,
    en : enUS
  }

  const isDateInLists = (date: Date): keyof CustomClassNames | undefined => {
    if (filled_days.some((d) => d.toDateString() === date.toDateString())) 
      return "filled";
    else if (maybe_filled_days.some((d) => d.toDateString() === date.toDateString())) 
      return "maybeFilled";
    else if (allowed_days.some((d) => d.toDateString() === date.toDateString())) 
      return "allowed";
    return undefined;
  };
  function isSameDay(date1:Date, date2:Date|undefined) {
    if (date2 == undefined) return false
    return  date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0]
  }

  return (
    <div className="scale-75 sm:scale-75 md:scale-100">
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={local_format[local]} // Set the locale to French
      className={cn("p-3 ", className)}
      classNames={{
        selectedDay : "selectedDay",
        filled: "filled",
        maybeFilled: "maybeFilled",
        allowed: "allowed",
        allowed_online: "allowed_online",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "secondary" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 p-2 rounded-md font-semibold"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-green-700 text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        ...classNames
      } as Partial<StyledElement<string>>}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      disabled={{ before: today }}
      modifiersClassNames={{
        filled: "filled",
        maybeFilled: "maybeFilled",
        allowed: "allowed",
        allowed_online : "allowed_online",
        selectedDay: "selectedDay"
      }}
      modifiers={{
        selectedDay:    (date) => isSameDay(date,selectedDay),
        filled:         (date) => isDateInLists(date) === "filled",
        maybeFilled:    (date) => isDateInLists(date) === "maybeFilled",
        allowed:        (date) => isDateInLists(date) === "allowed",
        allowed_online: (date) => isDateInLists(date) === "allowed_online",
      }}
      {...props}
    />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
