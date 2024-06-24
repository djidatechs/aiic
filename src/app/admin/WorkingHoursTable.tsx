import { CellFormat, CellType, Column, FetchDataParams } from "@/types/types";
import DashboardTable from "./DashSection";
import WhEdit from "./WHEditModel";
import WhCreate from "./WHCreateModel";
import AppointmentModel from "./AppointmentModel";

function WorkingHoursTable() {

    const columns: Column<any>[] = [
        {header:"date", accessor : "date", format: CellFormat.DATE, type : CellType.SIMPLE},
        {header:"duration", accessor : "duration",format:CellFormat.DURATION, type : CellType.SIMPLE},
        {header:"type", accessor : "type", format:CellFormat.FALSE, type : CellType.SIMPLE},
        {header:"state", accessor : "state", format:CellFormat.FALSE, type : CellType.SIMPLE},
        {header:"created_At", accessor : "created_At",format:CellFormat.DATE, type : CellType.SIMPLE},
        {header:"appointment", accessor : "appointment[id]",format:CellFormat.EXIST, type : CellType.NESTED,
            special_col: {
                path:  "appointment.payment.isPayed",
                y_cn : "bg-green-500/25 font-bold text-black cursor-pointer",
                n_cn : "bg-orange-500/25 font-bold text-black cursor-pointer",
                // redirect : "booked/appointment.id",
                col_extend : true,
            }
        } 
    ]

    const fetchData = async (params : FetchDataParams)=> {
        const fetcher  = (await fetch(`/api/admin/workinghours/get/filter?${parseFilterParams (params,columns)}`)).json();
        console.log(fetcher)
        return fetcher
    }
    const updateRow = async (id : string|number)=> {
        const resp = await (await fetch(`/api/admin/workinghours/get/${id}`)).json();
        return resp?.workinghours
    }
    
   
        
    return (
        <>
        <DashboardTable
        columns={columns}
        fetchData={fetchData}
        updateRow={updateRow}
        EditModel={WhEdit}
        CreateModel={WhCreate}
        ColExtendModel= {AppointmentModel}
        />
        
      </>
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
        if (! order.value || order.column.match(/(.*)\[(.*)\]/) ) return
        else str += "&order"+ "["+order.column+"]"+"="+order.value
    })
    return str
}
