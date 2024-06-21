
import { NextRequest, NextResponse } from 'next/server';
import { SafeParseReturnType } from 'zod';

export function generateRandomString(length: number = 12): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




export function setNestedProperty(obj:any, path:string, value:any) {
    const keys = path.split('.');
    let current = obj;
  
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }
  
    current[keys[keys.length - 1]] = value;
  }


  export const constructFilter = (where : any , fieldName: string, value: any ,transform?: (a: any) => any) => {
    transform = transform || ((a: any) => a);
    if (value.exact !== undefined) {
      setNestedProperty(where, fieldName ,transform(value.exact))
    } else {
      where[fieldName] = {};
      if (value.min !== undefined)  setNestedProperty(where, fieldName+'.gte',transform(value.min))
      if (value.max !== undefined)  setNestedProperty(where, fieldName+'.lte',transform(value.max))
      if (value.in  !== undefined)  setNestedProperty(where, fieldName+'.in' ,transform(value.in))
      if (value.not  !== undefined)  setNestedProperty(where, fieldName+'.not' ,transform(value.not))
    }
  };



  export function parseSearchParams(searchParams: URLSearchParams): Record<string, any>|undefined {
    const query: Record<string, any> = {};
  
    // Function to set values in the result object, handling nested properties
    function setNestedValue(obj: Record<string, any>, keys: string[], value: any) {
        const lastKey = keys.pop()!;
        const lastObj = keys.reduce((obj, key) => 
            obj[key] = obj[key] || {}, 
            obj
        );
        lastObj[lastKey] = value;
    }
    for (const [key, value] of searchParams.entries() as any) {
        const keyParts = key.split(/[\[\]]+/).filter(Boolean);
        setNestedValue(query, keyParts, value === 'true' ? true : value === 'false' ? false : value);
    }
    return Object.keys(query).length ? query : undefined ;
  }
  
  
  

