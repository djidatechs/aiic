import * as z from "zod";
import wilayas from "./wilayas.json";


const today = new Date() ; today.setHours(0,0,0,0);
const PaymentMethod = z.enum(['CCPBaridiMob', 'OnSite'], {
  required_error: "Le mode de paiement est requis",
});
// const ageSchema = z
//   .string({ required_error: "Champ obligatoire" })
//   .transform((arg) => parseInt(arg, 10))
//   .refine((val) => val >= 1, { message: "L'âge doit être un entier positif" });
export const FormSchema = z.object({
  firstName: z.string({required_error:"Champ obligatoire"}).min(1, { message: "Le prénom est requis" }),
  lastName: z.string({required_error:"Champ obligatoire"}).min(1, { message: "Le nom est requis" }),
  age: z.string({ required_error: "Champ obligatoire" }),
  phoneNumber: z.string({required_error:"Champ obligatoire"}).min(10, { message: "Le numéro de téléphone doit contenir au moins 10 chiffres" }),
  email: z.string({required_error:"Champ obligatoire"}).email({ message: "Adresse email invalide" }).optional(),
  wilaya: z.string({required_error:"Champ obligatoire"}).min(1, "Wilaya est requise").refine((value) => {
    return wilayas.includes(value); }, { message: "Wilaya invalide" }),

  WorkingHour : z.number({required_error:"Champ obligatoire : Date et heur"}),
  PaymentMethod: PaymentMethod,
  additionalInfo: z.string().max(200).optional(),
});

export type FormValues = z.infer<typeof FormSchema>;




export const signInFormSchema = z.object({
  username: z.string().min(1, "Requis"),
  password: z.string().min(1, "Requis"),
});
export type signInFormValues = z.infer<typeof signInFormSchema>;


const MAX_FILE_SIZE = 5000000;
function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "jpg" || fileType === "png") return true;
    }
    return false;
}


export const fileSchema = z.object({
  file : z.any()
  .refine((file: File) => file?.size !== 0, "File is required")
  .refine((file) => file.size < MAX_FILE_SIZE, "Max size is 5MB.")
  .refine((file) => checkFileType(file), ".jpg ou .png"),
  });
  export type fileValues = z.infer<typeof fileSchema>;