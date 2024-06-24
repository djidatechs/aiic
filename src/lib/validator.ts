import * as z from "zod";
import wilayas from "./wilayas.json";


/************************************************************************************** */
/***************************                            ******************************* */
/***************************       FIle validator       ******************************* */
/***************************                            ******************************* */
/************************************************************************************** */




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
  // PaymentMethod: PaymentMethod,
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
const id_schema = z.string().transform(n=>parseInt(n)).or(z.number())
const select_schema: z.ZodType<any> = z.lazy(() => 
  z.record(
    z.union([z.boolean(), select_schema])
  ))

  const order_schema: z.ZodType<any> = z.lazy(() => 
    z.record(
      z.union([z.enum(["asc", "desc"]), select_schema])
    ))

const workinghours_commun_schema = z.object({
  // [IMPORTANT : KEEP DATE AND DURATION IN TOP]
  date: z.string().transform((val) => new Date(val)),
  duration: z.number().int().positive(),
  type: z.enum(["InPerson", "Online"]),
  state: z.enum(["ACTIVE", "PAUSED", "REMOVED", "COMPLETED"]).default("ACTIVE"),  
})
const workinghours_commun_str_schema = workinghours_commun_schema.extend({duration: z.string().transform((n)=>parseInt(n))})
const workinghours_commun_with_id_schema = workinghours_commun_schema.extend({id:id_schema})
export const workinghours_client_schema = z.object({
  // [IMPORTANT : KEEP DATE AND DURATION IN TOP]
  date: z.string().optional(),
  duration: z.number().int().positive().optional().or(z.string().transform(z=>parseInt(z))),
  type: z.enum(["InPerson", "Online"]).optional(),
  state: z.enum(["ACTIVE", "PAUSED", "REMOVED", "COMPLETED"]).default("ACTIVE").optional(),
})

export const workinghours_edit_schema = workinghours_client_schema.extend({ id : z.number().or(z.string())})

export type workinghours_edit_values = z.infer<typeof workinghours_edit_schema>;
export type workinghours_client_values = z.infer<typeof workinghours_client_schema>;


export const workinghours_create_schema = workinghours_commun_schema 
export const workinghours_update_schema = workinghours_commun_with_id_schema.partial() // needs id
export const workinghours_updatebatch_schema = z.array(workinghours_update_schema)
export const workinghours_get_by_id_schema = id_schema
export const workinghours_get_filter_schema = (traverseZodSchema(workinghours_commun_str_schema) as z.AnyZodObject )
        .merge(z.object({appointment : z.object({id : id_schema,})})).merge(SelectFilterAid()).partial().optional()



/****************************************************************************************** */
/****************************************************************************************** */
/***************************                                ******************************* */
/***************************     admin appointment Schema   ******************************* */
/***************************                                ******************************* */
/****************************************************************************************** */
/****************************************************************************************** */


export const payment_commun_schem = z.object({
  id : id_schema,
  amount : z.string().transform(n=>parseInt(n)),
  payed : z.string().transform(n=>parseInt(n)),
  updated_At : z.string().transform(d=> new Date(d)),
  created_At : z.string().transform(d=> new Date(d)),
  recite_path : z.string()
})

export const client_commun_schem = z.object({
  id : id_schema,
  firstName : z.string(),
  lastName  : z.string(),
  age       : z.string().transform(n=>parseInt(n)),
  phoneNumbe: z.string(),
  email     : z.string().email(),
  wilaya    : z.string(),
  ipAddress : z.string(),
  created_At  : z.string().transform(d=> new Date(d)),
  updated_At  : z.string().transform(d=> new Date(d)),
})


export const appointment_commun_schema = z.object({
  id : id_schema,
  link : z.string(),
  state   : z.enum([ "SCHEDULED","COMPLETED","CANCELLED","CONFIRMED" ]),
  clientId:z.string().transform(n=>parseInt(n)),
  WorkingHoursId: z.string().transform(n=>parseInt(n)),
  updated_At : z.string().transform(d=> new Date(d)),
  created_At : z.string().transform(d=> new Date(d)),
  payment : payment_commun_schem,
  client : client_commun_schem,
})


export const appointment_create_schema = appointment_commun_schema 
export const appointment_update_schema = appointment_commun_schema
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
    order: order_schema,
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


