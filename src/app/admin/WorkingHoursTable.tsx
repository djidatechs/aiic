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
        {header:"appointment", accessor : "appointment[created_At]",format:CellFormat.DATE, type : CellType.NESTED,
            special_col: {
                path:  "appointment.payment.isPayed",
                y_cn : "bg-green-500/25 font-bold text-black cursor-pointer",
                n_cn : "bg-orange-500/25 font-bold text-black cursor-pointer",
                // redirect : "booked/appointment.id",
                col_extend : true,
                onclick_id : "id",
                order_by : "created_At",
            }
        } 
    ]

    const fetchData = async (params : FetchDataParams)=> {
        const fetcher  = (await fetch(`/api/admin/workinghours/get/filter?${parseFilterParams (params)}`)).json();
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


function parseFilterParams (params:  FetchDataParams)  {
    let str :string = "";
    str += "&page="+params.page
    str += "&limit="+params.limit
    params.filters?.map(filter=> {
        str += "&"+filter.column+"["+filter.condition+"]"+"="+filter.value
    })
    params.orders?.map(order=>{

        if (! order.value)  return
        console.log({type : order.type==CellType.NESTED})
        
        if (order.type==CellType.NESTED ){
            console.log(order.column)
            var match = order.column.match(/(.*)\[(.*)\]/)
            if (! match) return 
            str += "&order"+ "["+match[1]+"]"+  "["+match[2]+"]"+ "="+order.value
            console.log({match})
        }

        else  str += "&order"+ "["+order.column+"]"+"="+order.value
    })
    return str
}
