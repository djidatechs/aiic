"use client";

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

const MyForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: FormValues) {
    toast({
      className: "bg-blue-600 text-white font-semiBold text-lg",
      description: "Traitement de votre rendez-vous...",
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
        toast({
          className: "bg-green-600 text-white font-semiBold",
          description: "Rendez-vous créé avec succès",
        });
        // form.reset();
        let {appointment} = await response.json()
        
        if (appointment?.link ) {toast({
          className: "bg-green-600 text-white font-semiBold",
          description: "Rendez-vous créé avec succès",
        });
        router.push(`/rv/${appointment.link}`)}
       
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du rendez-vous');
      }
    } catch (error) {
      console.log({error})
      toast({
        className: "bg-red-600 text-white font-semiBold",
        description: "Ops! ",
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
        {/* Form fields remain the same */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nom" {...field} />
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
              <FormLabel>Prenom</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Prenom" {...field} />
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
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={100} placeholder="Age" {...field} />
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
              <FormLabel>Numéro téléphone</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Numéro téléphone" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
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
              <FormLabel>Wilaya</FormLabel>
              <FormControl>
                <select {...field} className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400">
                  <option value="">Sélectionnez une wilaya</option>
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
        <FormField
          control={form.control}
          name="PaymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Méthode de paiement initial</FormLabel>
              <FormControl>
                <select {...field} className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400">
                  <option value="">Méthode de paiment</option>
                  <option value="OnSite">Sur place (En présence)</option>
                  <option value="CCPBaridiMob">CCP / BARIDI MOB</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DatePicker  
          form={form}
          name="WorkingHour"
          placeholder="Réservation"
        />
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informations Complémentaires <label className="text-gray-500">(optional, 200 lettres max)</label></FormLabel>
              <FormControl>
                <RichTextEditor 
                placeholder="si vous souhaitez ajouter des informations supplémentaires, vous pouvez les ajouter ici."
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
          Réserver 
        </LoadingButton>
      </form>
    </Form>
  );
};

export default MyForm;
