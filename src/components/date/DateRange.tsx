//@ts-nocheck
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';


// function formatDate(date: Date | undefined) {
//   if (!date) {
//     return ""
//   }

//   return date.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   })
// }

interface CalendarProps {

  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date | undefined;
    to: Date | undefined;
  }>>;
}


export function Calendar28 ({dateRange,setDateRange}:CalendarProps) {
  
  return (
    <div className="space-y-2 col-span-1 md:col-span-2">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start text-left font-normal rounded text-[#959595] cursor-pointer"
              >
                {dateRange.from ? (
                    format(dateRange.from, 'PPP')
                ) : (
                    <span>Start Date</span>
                )}
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange({ ...dateRange, from: new Date(format(date, 'yyyy-MM-dd')) })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <span></span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start text-left font-normal rounded text-[#959595] cursor-pointer"
              >
                {dateRange.to ? (
                    format(dateRange.to, 'PPP')
                ) : (
                    <span>End date</span>
                )}
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange({ ...dateRange, to: new Date(format(date, 'yyyy-MM-dd')) })}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
  )
}
