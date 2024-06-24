"use client";
import { useEffect, useState } from "react";
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
  workinghours_edit_schema,
  workinghours_edit_values,
} from "@/lib/validator";
import { useToast } from "@/components/ui/use-toast";
import Modal from "./Modal";
import { formatDateTime } from "@/lib/functions";

const WhEdit = ({ setLoading, OnClose, whid }
    : {edit:any, whid: string | number, OnClose: any,setLoading: any}) => {
  const { toast } = useToast();
  const [initialValues, setInitialValues] = useState<workinghours_edit_values | null>(null);


  const form = useForm<workinghours_edit_values>({
    defaultValues: initialValues ?? { id: whid },
    resolver: zodResolver(workinghours_edit_schema),
  });

  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/workinghours/get/${whid}`);
        if (response.ok) {
          const data = await response.json();
          if (data.workinghours) {
            data.workinghours.date = formatDateTime(data.workinghours.date)
          setInitialValues(data.workinghours);
          form.reset(data.workinghours)
        }
        
          
        } else {
          throw new Error("Failed to fetch initial values");
        }
      } catch (error) {
        console.error("Error fetching initial values:", error);
        toast({
          className: "bg-red-600 text-white font-semiBold",
          description: "Error loading initial values",
        });
      }
      setLoading(false)
    };
    

    fetchInitialValues();
  }, [whid]);

  async function onSubmit(values: workinghours_edit_values) {
    toast({
      className: "bg-blue-600 text-white font-semiBold text-lg",
      description: "updating...",
    });

    try {
      const response = await fetch("/api/admin/workinghours/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          className: "bg-green-600 text-white font-semiBold",
          description: "Update successful",
        });
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

  if (!initialValues) {
    return <></>
  }

  return (
    <Modal whid={whid} onClose={() => OnClose()}>
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
                    <option defaultChecked={true} value="ACTIVE">ACTIVE</option>
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

export default WhEdit;
