import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-semibold text-foreground",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-card p-0 opacity-70 hover:opacity-100 hover:bg-accent/20 border-border/50 transition-all duration-200 shadow-sm",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex mb-2",
        head_cell: "text-primary font-semibold rounded-lg w-10 h-8 flex items-center justify-center text-xs uppercase tracking-wide",
        row: "flex w-full mt-1",
        cell: cn(
          "relative h-10 w-10 text-center text-sm p-0.5 transition-all duration-200",
          "[&:has([aria-selected].day-range-end)]:rounded-r-xl",
          "[&:has([aria-selected].day-outside)]:bg-accent/30",
          "[&:has([aria-selected])]:bg-primary/10",
          "first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium aria-selected:opacity-100 rounded-xl transition-all duration-200 hover:bg-accent/30 hover:scale-105"
        ),
        day_range_end: "day-range-end",
        day_selected: cn(
          "gradient-primary text-primary-foreground shadow-glow",
          "hover:bg-primary hover:text-primary-foreground",
          "focus:bg-primary focus:text-primary-foreground",
          "rounded-xl font-bold"
        ),
        day_today: cn(
          "bg-accent/40 text-accent-foreground font-bold",
          "ring-2 ring-primary/30 ring-offset-1 ring-offset-background rounded-xl"
        ),
        day_outside: "day-outside text-muted-foreground/40 opacity-50 aria-selected:bg-accent/30 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/30 opacity-30 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent/20 aria-selected:text-accent-foreground rounded-none",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
