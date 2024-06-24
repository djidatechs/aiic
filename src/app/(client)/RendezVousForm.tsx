"use client";

import { useTranslation } from "@/lib/i18n/client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/shared/LoadingButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { FormSchema, FormValues } from "@/lib/validator";
import { draftToMarkdown } from "markdown-draft-js";
import wilayas from "@/lib/wilayas.json";
import { DatePicker } from "@/components/shared/DatePicker";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { useState } from "react";

const MyForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation("common"); // Initialize translation function
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: FormValues) {
    toast({
      className: "bg-blue-600 text-white font-semiBold text-lg",
      description: t('processing_appointment'), // Use translation key
    });

    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // form.reset();
        let { appointment } = await response.json();

        if (appointment?.link) {
          toast({
            className: "bg-green-600 text-white font-semiBold",
            description: t('appointment_success'), // Use translation key
          });
          
          router.push(`/rv/${appointment.link}`)
        }

      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || t('appointment_error')); // Use translation key
      }
    } catch (error) {
      console.log({ error });
      toast({
        className: "bg-red-600 text-white font-semiBold",
        description: t('oops'), // Use translation key
      });
    }
  }

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-9"
        noValidate
      >
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('last_name')}</FormLabel> 
              <FormControl>
                <Input type="text" placeholder={t('last_name')} {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('first_name')}</FormLabel> 
              <FormControl>
                <Input type="text" placeholder={t('first_name')} {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('age')}</FormLabel> 
              <FormControl>
                <Input type="number" min={1} max={100} placeholder={t('age')} {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phone_number')}</FormLabel> 
              <FormControl>
                <Input type="text" placeholder={t('phone_number')} {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel> 
              <FormControl>
                <Input type="email" placeholder={t('email')} {...field} /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                      {(index + 1) + "- " + wilaya}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="PaymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('initial_payment_method')}</FormLabel> 
              <FormControl>
                <select {...field} className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400">
                  <option value="">{t('payment_method')}</option> 
                  <option value="OnSite">{t('on_site')}</option> 
                  <option value="CCPBaridiMob">{t('ccp_baridi_mob')}</option> 
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <DatePicker  
          form={form}
          name="WorkingHour"
          placeholder={t('reservation')} 
        />
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('additional_info')} 
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  placeholder={t('additional_info_placeholder')} 
                  onChange={(draft) => field.onChange(draftToMarkdown(draft))} ref={field.ref} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          className="bg-red-700 hover:bg-red-800"
          loading={form.formState.isSubmitting}
          onClick={(event) => {
            console.log("errors:", form.formState.errors);
            
          }}
        >
          {t('book')} 
        </LoadingButton>
      </form>
    </Form>
  );
};

export default MyForm;
