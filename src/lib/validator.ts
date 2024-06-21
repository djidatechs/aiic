import * as z from "zod";
import wilayas from "./wilayas.json";




/************************************************************************************** */
/***************************                            ******************************* */
/***************************    Main Page Form Schema   ******************************* */
/***************************                            ******************************* */
/************************************************************************************** */
const today = new Date() ; today.setHours(0,0,0,0);
const PaymentMethod = z.enum(['CCPBaridiMob', 'OnSite'], {
required_error: "Le mode de paiement est requis",
});


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



/************************************************************************************** */
/***************************                            ******************************* */
/***************************     Admin Sign in Schema   ******************************* */
/***************************                            ******************************* */
/************************************************************************************** */


export const signInFormSchema = z.object({
  username: z.string().min(1, "Requis"),
  password: z.string().min(1, "Requis"),
});
export type signInFormValues = z.infer<typeof signInFormSchema>;

/************************************************************************************** */
/***************************                            ******************************* */
/***************************     Working Hours Schema   ******************************* */
/***************************                            ******************************* */
/************************************************************************************** */
//id schema
const id_schema = z.string().transform(n=>parseInt(n))
const select_schema: z.ZodType<any> = z.lazy(() => 
  z.record(
    z.union([z.boolean(), select_schema])
  ))


const workinghours_commun_schema = z.object({
  // [IMPORTANT : KEEP DATE AND DURATION IN TOP]
  date: z.string().transform((val) => new Date(val)),
  duration: z.number().int().positive(),
  type: z.enum(["InPerson", "Online"]),
  state: z.enum(["ACTIVE", "PAUSED", "REMOVED", "COMPLETED"]).default("ACTIVE"),
  id : id_schema,
  appointment : z.object({id : id_schema,})
  
})





export const workinghours_create_schema = workinghours_commun_schema 
export const workinghours_update_schema = workinghours_commun_schema.extend({id:id_schema}) // needs id
export const workinghours_updatebatch_schema = z.array(workinghours_update_schema)
export const workinghours_get_filter_schema = (traverseZodSchema(workinghours_commun_schema) as z.AnyZodObject ).merge(SelectFilterAid()).partial().optional()
export const workinghours_get_by_id_schema = id_schema




/****************************************************************************************** */
/****************************************************************************************** */
/***************************                                ******************************* */
/***************************     admin appointment Schema   ******************************* */
/***************************                                ******************************* */
/****************************************************************************************** */
/****************************************************************************************** */


const payment_commun_schem = z.object({
  id : id_schema,
  amount : z.string().transform(n=>parseInt(n)),
  payed : z.string().transform(n=>parseInt(n)),
  updated_At : z.string().transform(d=> new Date(d)),
  created_At : z.string().transform(d=> new Date(d)),
  recite_path : z.string()
})
export const appointment_commun_schema = z.object({
  id : id_schema,
  link : z.string(),
  state   : z.enum([ "SCHEDULED","COMPLETED","CANCELLED","CONFIRMED" ]),
  clientId:z.string().transform(n=>parseInt(n)),
  WorkingHoursId: z.string().transform(n=>parseInt(n)),
  updated_At : z.string().transform(d=> new Date(d)),
  created_At : z.string().transform(d=> new Date(d)),
  payment : payment_commun_schem
})


export const appointment_create_schema = appointment_commun_schema 
export const appointment_update_schema = appointment_commun_schema.extend({id:id_schema}) // needs id
export const appointment_updatebatch_schema = z.array(appointment_update_schema)
// export const appointment_get_filter_schema = appointment_commun_schema.merge(createappointmentFilterAid1Schema()).merge(SelectFilterAid()).partial().optional()
export const appointment_get_filter_schema = (traverseZodSchema(appointment_commun_schema) as z.AnyZodObject ).merge(SelectFilterAid()).partial().optional()
export const appointment_get_by_id_schema = id_schema




/****************************************************************************************** */
/****************************************************************************************** */
/***************************                                ******************************* */
/***************************          commun stuff          ******************************* */
/***************************                                ******************************* */
/****************************************************************************************** */
/****************************************************************************************** */



function SelectFilterAid () {
  return z.object({
    select: select_schema,
    order: z.record(z.string(), z.enum(["asc", "desc"])),
    page: z.string(),
    limit: z.string()
  });
};


function traverseZodSchema(schema: z.ZodType): z.ZodTypeAny {
  if (schema instanceof z.ZodObject) {
    
    const newShape: Record<string, z.ZodTypeAny> = {};
    for (const [key, field] of Object.entries(schema.shape)) {
      if (field instanceof z.ZodType ) newShape[key] = traverseZodSchema(field)
    }
    return  z.object(newShape)
  } else {
    // It's a leaf node (primitive type or union)
    return ExactMinMaxInProps(schema);
  }
}

function ExactMinMaxInProps<ItemType extends z.ZodTypeAny>(itemSchema: ItemType) {
  return z.object({
    exact: itemSchema.optional(),
    min:   itemSchema.optional(),
    max:   itemSchema.optional(),
    in:    itemSchema.optional(),
    not:   itemSchema.optional(),
  }).partial().optional();
}
  
function getSchemaKeys<T extends z.ZodRawShape>(schema: z.ZodObject<T>): (keyof T)[] {
  const schemaShape = schema._def.shape();
  return Object.keys(schemaShape) as (keyof T)[];
}


