
import { CellFormat, CellType } from '@/types/types';
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
  
  
  




export const addFilters = (where:any, data:any, schema:any, prefix = '') => {
    const keys = Object.keys(schema.shape);

    keys.forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const schemaType = schema.shape[key]._def.typeName;

        if (schemaType === 'object') {
            addFilters(where, data[key], schema.shape[key], fullKey);
        } else if (data?.[key] !== undefined) {
            constructFilter(where, fullKey, data[key]);
        }
    });
};

 function getFormattedDateTime(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear() % 100).padStart(2, '0'); // Get last two digits of the year
  
    const hours = String(date.getHours()).padStart(2, '0'); // Pad single digit hours with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad single digit minutes with leading zero
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function minutesToHoursMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    console.log((hours ? hours + 'h' : '') + (minutes ? minutes + 'm' : ''))
    return (hours ? hours + 'h' : '') + (minutes ? minutes + 'm' : '');
  }

  export function getFormattedCell(accessor:any ,row : any, format : CellFormat, type? : CellType) {
    if (type == CellType.NESTED) {
        var match = accessor.match(/(.*)\[(.*)\]/)
        if (! match) return "!"
        row = row[match[1]]
        accessor= match[2]
    }
    if (format==CellFormat.DATE) return getFormattedDateTime(new Date(row[accessor]))
    if (format==CellFormat.DURATION) return minutesToHoursMinutes(row[accessor])
    if (format==CellFormat.EXIST) return "YES"
    
    return row[accessor]
}

  
