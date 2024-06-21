
function Analytics() {
    return (
        <div className="w-full flex flex-wrap">
            <Alaytic title="Total clients" value={"50 client"} />
            <Alaytic title="Waiting clients" value={"50 client"} />
            <Alaytic title="Total gains" value={"95"} />
            
   
        </div>
    );
}

export default Analytics;


function Alaytic({title, value} : {title?:string,value?:string|number}){

    return (
        <div className="h-26 p-2 w-1/4 text-black text-center font-bold ">
            <div className="p-2   bg-slate-100 border-2 border-slate-300 rounded-xl  w-full h-full">
                <h1 className="mb-3">{title}</h1>
                <p className="p-6 mb-3 mx-5 text-red-700 bg-white rounded-xl">{value}</p>
            </div>
        </div>
    )
}