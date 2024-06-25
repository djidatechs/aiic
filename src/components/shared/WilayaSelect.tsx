"use client"
import wilayas from "@/lib/wilayas.json";
import { useTranslation } from "@/lib/i18n/client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface WilayasSelectProps {
  form: any;
}

const WilayasSelect = ({  form }:WilayasSelectProps) => {
  const { t } = useTranslation("common");
  const { t: w } = useTranslation("wilayas");

  return (
    <FormField
          control={form.control}
          name="wilaya"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('wilaya')}</FormLabel> 
              <FormControl>
                <select {...field} className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400">
                  <option value="">{t('select_wilaya')}</option> 
                  {wilayas.map((wilaya, index) => (
                    <option key={wilaya} value={wilaya}>
                      {(index + 1) + "- " + w(wilaya)}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
  );
};

export default WilayasSelect;
