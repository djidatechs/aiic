import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/shared/LoadingButton";
import {
  workinghours_client_schema,
  workinghours_client_values,
} from "@/lib/validator";
import { useToast } from "@/components/ui/use-toast";
import Modal from "./Modal";
import { useState } from "react";

const WhCreate = ({  OnClose} : { OnClose: (newWh:any)=>any}) => {
  const { toast } = useToast();
  const [newWh,setNewWh] =useState<number | null >(null)
  const form = useForm<workinghours_client_values>({
    resolver: zodResolver(workinghours_client_schema),
  });

  async function onSubmit(values: workinghours_client_values) {
    toast({
      className: "bg-blue-600 text-white font-semiBold text-lg",
      description: "creating...",
    });

    try {
      const response = await fetch("/api/admin/workinghours/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          className: "bg-green-600 text-white font-semiBold",
          description: "Update successful",
        });
        let data = await response.json()
        if (data?.wh ) setNewWh(data.wh)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.log({ error });
      toast({
        className: "bg-red-600 text-white font-semiBold",
        description: "Error",
      });
    }
  }
  

  return (
    <Modal onClose={()=>OnClose(newWh)}>
      <Form {...form}>
        <form
          encType="multipart/form-data"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-9"
          noValidate
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                  >
                    <option >select state</option>
                    <option selected={true} value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="REMOVED">REMOVED</option>
                    {/* <option value="COMPLETED">COMPLETED</option> */}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
                  >
                    <option>select type</option>
                    <option value="InPerson">InPerson</option>
                    <option value="Online">Online</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            className="bg-red-700 hover:bg-red-800"
            loading={form.formState.isSubmitting}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </Modal>
  );
};

export default WhCreate;
