"use client";
import LoadingButton from "@/components/shared/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signInFormValues, signInFormSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<signInFormValues>({
    resolver: zodResolver(signInFormSchema),
  });


  async function onSubmit(values: signInFormValues) {
    
    
    try {
    
      const result = await signIn("credentials", {
        redirect: false,
        email: values.username,
        password: values.password,
      });
      console.log(result)
      if (!result?.ok) {
        toast({
          className: "bg-red-600 text-white text-md font-medium",
          title: "Username or Password Invalid",
        });
      }
      if (result?.ok) {
        toast({
          className: "bg-green-600 text-md text-white font-medium",
          title: "User has been logged in successfully",
        });
        router.push("/admin");
        router.refresh();
      }
      console.log(result);
    } catch (error) {
      toast({
        className: "bg-red-600 text-white text-md font-medium",
        title: "Something went wrong please try again.",
      });
    }
  }

  return (
    <div className="mx-auto bg-white m-6 p-4 rounded-xl  max-w-[600%] w-full md:w-2/3 lg:w-1/2">
    <h1 className="text-red-700 text-3xl text-center font-semibold mb-6">AIIC ADMINISTRATION</h1>   
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <FormControl>
                <Input type="text" placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
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
          Sign in
        </LoadingButton>

      </form>
    </Form>
    </div>
  );
};

export default SignInForm;