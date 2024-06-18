"use client";

import { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { format } from 'date-fns';
import { fr, enUS , arDZ } from 'date-fns/locale';
import { useLocale } from '../hooks/local';
import { useTranslation } from '@/lib/i18n/client';

// Skeleton component for loading state
const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded-md flex-1 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

interface DatePickerProps {
  form: any;
  name: string;
  placeholder: string;
}

interface WorkingHour {
  id: number;
  date: string;
  startTime: string;
  available: boolean;
  confirmed: boolean;
  duration: number;
  type: string;
}

interface DaysStatus {
  filled_days: string[];
  maybe_filled_days: string[];
  allowed_days: string[];
}

export function DatePicker({ form, name, placeholder }: DatePickerProps) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [daysStatus, setDaysStatus] = useState<DaysStatus>({ filled_days: [], maybe_filled_days: [], allowed_days: [] });
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [day_loading, setday_Loading] = useState<boolean>(true); // Loading state
  const {t} = useTranslation("common")
  const local = useLocale()

  const local_format = {
    ar: arDZ,
    fr,
    en : enUS
  }
  useEffect(() => {
    // Fetch the status of all days
    const fetchDaysStatus = async () => {
      try {
        const res = await fetch('/api/getDaysStatus');
        if (!res.ok) throw new Error('Failed to fetch days status');
        const data = await res.json();
        console.log({data})
        const days_arr = Object.keys(data).map(key => data[key]?.map((obj: any) => obj.day)) as any;
        const days = {
          filled_days: days_arr[0],
          maybe_filled_days: days_arr[1],
          allowed_days: days_arr[2],
        };
        setDaysStatus(days);
        console.log({days})
        setday_Loading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDaysStatus();
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const fetchWorkingHours = async () => {
        setLoading(true); // Set loading to true when starting to fetch data
        try {
          const res = await fetch(`/api/getWorkingHoursByDay?date=${toLocalISOString(selectedDay)}`);
          if (!res.ok) throw new Error('Failed to fetch working hours');
          const data = await res.json();
          setWorkingHours(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false); // Set loading to false after data is fetched
        }
      };
      fetchWorkingHours();
    }
  }, [selectedDay]);

  const handleTimeChange = (id: number) => {
    if (selectedTime === id) {
      setSelectedTime(null);
      form.setValue('WorkingHour', undefined);
    } else {
      setSelectedTime(id);
      form.setValue('WorkingHour', id);
    }
  };

  const handleDayChange = (day: Date) => {
    if (daysStatus.allowed_days.includes(toLocalISOString(day))) {
      setSelectedDay(day);
    } else {
      setSelectedDay(undefined);
    }
    setWorkingHours([]);
    setSelectedTime(null);
  };

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <div className="lg:flex md:justify-center" dir="ltr">
            <div className="order-1 flex flex-col">
              <Label className="text-lg py-2 mt-2">{t('reservation')}</Label>
              <p className="space-x-2 flex justify-between">
                <strong className="text-green-500">{t('disponible')}</strong>
                <span className="inline-block w-4 h-4 rounded-sm bg-green-500 ml-auto" />
              </p>
              <p className="space-x-2 flex justify-between">
                <strong className="text-cyan-500">{t('en_ligne_seulement')}</strong>
                <span className="inline-block w-4 h-4 rounded-sm bg-cyan-500 ml-auto" />
              </p>
              <p className="space-x-2 flex justify-between">
                <strong className="text-orange-500">{t('pris_sans_confirmation')}</strong>
                <span className="inline-block w-4 h-4 rounded-sm bg-orange-500 ml-auto" />
              </p>
              <p className="space-x-2 flex justify-between">
                <strong className="text-red-500">{t('pris')}</strong>
                <span className="inline-block w-4 h-4 rounded-sm bg-red-500 ml-auto" />
              </p>
            </div>
    

            <FormItem className="order-2 flex flex-col mx-auto md:w-5/12">
              {day_loading ? <p className='font-semibold'>{t('still_loading')}</p> : <></>}
              <FormControl>
                
                <Calendar
                  selectedDay={selectedDay}
                  filled_days={daysStatus.filled_days.map(date => new Date(date))}
                  maybe_filled_days={daysStatus.maybe_filled_days.map(date => new Date(date))}
                  allowed_days={daysStatus.allowed_days.map(date => new Date(date))}
                  onDayClick={handleDayChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {selectedDay && (
              <FormItem className="order-2 flex flex-col md:w-3/12">
                <>
                  <FormLabel className="pb-6">
                    {selectedDay ? format(selectedDay, 'PPPP', { locale: local_format[local]   }) : t("no_selected_date")}
                    &nbsp;
                    {selectedTime && workingHours.find(wh => wh.id === selectedTime)?.startTime}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-5">
                      {loading ? (
                        <SkeletonLoader />
                      ) : (
                        workingHours.map(wh => (
                          <Label key={wh.id} className="flex items-center font-semibold space-x-2">
                            <input
                              type="checkbox"
                              value={wh.id}
                              onChange={() => handleTimeChange(wh.id)}
                              disabled={!wh.available}
                              checked={selectedTime === wh.id}
                              className="form-checkbox h-5 w-5"
                            />
                            <span className={
                              wh.available && wh.type === "Online" ? "text-cyan-600"
                                : wh.available ? "text-green-600"
                                  : wh.confirmed ? "text-red-600"
                                    : "text-orange-600"
                            }>{wh.startTime} ({minutesToHoursMinutes(wh.duration)}) {wh.available && wh.type === "Online" ? t("online") : ""}</span>
                          </Label>
                        ))
                      )}
                    </div>
                  </FormControl>
                </>
              </FormItem>
            )}
          </div>
        )}
      />
    </>
  );
}

function toLocalISOString(date: Date) {
  const pad = (num: any) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function minutesToHoursMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return (hours ? hours + 'h' : '') + (minutes ? minutes + 'm' : '');
}
