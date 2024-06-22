import { CellFormat, CellType, Column, FetchDataParams } from "@/types/types";
import DashboardTable from "./DashSection";

function WorkingHoursTable() {
    const columns: Column<any>[] = [
        {header:"date", accessor : "date", format: CellFormat.DATE, type : CellType.SIMPLE},
        {header:"duration", accessor : "duration",format:CellFormat.DURATION, type : CellType.SIMPLE},
        {header:"type", accessor : "type", format:CellFormat.FALSE, type : CellType.SIMPLE},
        {header:"state", accessor : "state", format:CellFormat.FALSE, type : CellType.SIMPLE},
        {header:"created_At", accessor : "created_At",format:CellFormat.DATE, type : CellType.SIMPLE},
        {header:"appointment", accessor : "appointment[id]",format:CellFormat.EXIST, type : CellType.NESTED} 
    ]

    const fetchData = async (params : FetchDataParams)=> {
        const fetcher  = (await fetch(`/api/admin/workinghours/get/filter?${parseFilterParams (params,columns)}`)).json();
        console.log({fetcher})
        return fetcher
    }
    const updateData = async (params : any)=> {
        await fetch(`/api/admin/workinghours/update/batch?${parseUpdateParams(params)}`);
        return 
    }
    
   
        
    return (
        <DashboardTable
        columns={columns}
        fetchData={fetchData}
        updateData={updateData}
        
      />
    );
}

export default WorkingHoursTable;


function parseFilterParams (params:  FetchDataParams,columns:any)  {
    let str :string = "";
    str += "&page="+params.page
    str += "&limit="+params.limit
    params.filters?.map(filter=> {
        str += "&"+filter.column+"["+filter.condition+"]"+"="+filter.value
    })
    params.orders?.map(order=>{
        var match = order.column.match(/(.*)\[(.*)\]/) //NESTED
        if (! order.value ) return
        if (match) str += "&order"+ "["+match[1]+"]"+"["+match[2]+"]"+"="+order.value
        else str += "&order"+ "["+order.column+"]"+"="+order.value
    })
    


    console.log({str})
    return str
    
}


function parseUpdateParams (params:  FetchDataParams)  {
    return params
    
}