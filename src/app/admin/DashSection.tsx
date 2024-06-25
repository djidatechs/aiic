"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table"; 
import { cn } from "@/lib/utils"; 
import { CellFormat, CellType, FilterCriteria, OrderCriteria, TableProps } from "@/types/types";
import { getFormattedCell } from "@/lib/functions";
import { ArrowDown, ArrowUp, Edit, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import PageLoading from "./PageLoading";

const DashboardTable = <T extends { id: string | number }>({ columns, fetchData, updateRow, EditModel, CreateModel,ColExtendModel }: TableProps<T>) => {
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [orders, setOrders] = useState<OrderCriteria[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [tempFilters, setTempFilters] = useState<FilterCriteria[]>([]);
  const [edit, setEdit] = useState<string | number | undefined>(undefined);
  const [create, setCreate] = useState<boolean>(false);
  const [colExtend, setColExtend] = useState<string|number|boolean>(false);
  const [totalPagination, setTotalPagination] = useState<{ total: number, totalPages: number }>({ total: 0, totalPages: 0 });
  const [inputPage, setInputPage] = useState('');
  const [pageloading,setPageLoading] = useState(true);
  const router = useRouter()

  const handleInputChange = (event:any) => {
    setInputPage(event.target.value);
  };

  const handleGoToPage = () => {
    const page = Math.min(Math.max(parseInt(inputPage, 10), 1), totalPagination.totalPages);
    if (!isNaN(page) && page !== currentPage) {
      handlePageChange(page);
    }
    setInputPage(''); // Clear input after submission
  };

  useEffect(() => {
    loadData();
  }, [currentPage, rowsPerPage, filters, orders]);

  const loadData = async () => {
    setPageLoading(true)
    const response = await fetchData({ orders, page: currentPage, limit: rowsPerPage, filters });
    setPageLoading(false)
    setFilteredData(response.data);
    setTotalPagination({ total: response?.pagination?.total || 0, totalPages: response?.pagination?.totalPages || 0 });
  };

  // Handle temporary filter changes (before applying)
  const handleTempFilterChange = (index: number, name: keyof FilterCriteria, value: string) => {
    setTempFilters((prevTempFilters) => {
      const newTempFilters = [...prevTempFilters];
      newTempFilters[index] = { ...newTempFilters[index], [name]: value };
      return newTempFilters;
    });
  };

  // Handle applying the temporary filters to actual filters
  const handleApplyFilter = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
  };

  const handleSetOrders = (column: string, type: CellType, rightClick = false) => {
    setOrders((orders: any) => {
      let exist = false;
      const newOrders = orders.map((order: any) => {
        if (order.column === column) {
          exist = true;
          return {
            column: order.column,
            value: rightClick ? null : order.value === "desc" ? "asc" : "desc",
          };
        }
        return order;
      });
      if (!exist) newOrders.push({ column, value: "desc" });
      return newOrders;
    });
  };

  const handleAddFilter = () => {
    setTempFilters((prev) => [...prev, { column: "", value: "", condition: "exact" }]);
  };

  const handleRemoveFilter = (index: number) => {
    setTempFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };
  

  const handleNewRow = async (row: any) => {
    
    try {
        setFilteredData((prevFilteredData) => [row, ...prevFilteredData] );
      }
     catch (error) {
      console.error("Error updating row:", error);
    }
  };
  const handleUpdateRow = async (id: string | number) => {
    
    try {
      const updatedRow = await updateRow(id);
      if (updatedRow) {
        setFilteredData((prevFilteredData) =>
          prevFilteredData.map((row) => (row.id === id ? updatedRow : row))
        );
      }
    } catch (error) {
      console.error("Error updating row:", error);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          {tempFilters.map((filter, index) => (
            <div key={index} className="mb-2">
              <label>
                Column:
                <select
                  name="column"
                  value={filter.column}
                  className="ml-2"
                  onChange={(e) => handleTempFilterChange(index, 'column', e.target.value)}
                >
                  <option value="">Column</option>
                  {columns?.map((col) => (
                    <option key={col.accessor as string} value={col.accessor as string}>
                      {col.header}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ml-2">
                Condition:
                <select
                  name="condition"
                  value={filter.condition}
                  className="ml-2"
                  onChange={(e) => handleTempFilterChange(index, 'condition', e.target.value)}
                >
                  <option value="equals">Equals</option>
                  <option value="not">Not</option>
                  <option value="min">Min</option>
                  <option value="max">Max</option>
                </select>
              </label>

              <label className="ml-2">
                Value:
                <input
                  type="text"
                  name="value"
                  value={filter.value}
                  className="ml-2"
                  onChange={(e) => handleTempFilterChange(index, 'value', e.target.value)}
                />
              </label>

              <button onClick={() => handleRemoveFilter(index)} className="ml-2 px-4 py-2 bg-red-500 text-white rounded">
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddFilter} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
            Add Filter
          </button>
          <button onClick={handleApplyFilter} className="ml-2 px-4 py-2 bg-green-500 text-white rounded">
            APPLY
          </button>
        </div>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="select-none bg-red-500 hover:bg-red-500 cursor-pointer">
            {columns.map((col, index) => (
              <TableHead
                onClick={() => handleSetOrders(col.accessor, col.type)}
                onContextMenu={(e) => { e.preventDefault(); handleSetOrders(col.accessor, col.type, true) }}
                className={`text-white font-semibold hover:bg-red-700 transition duration-150`}
                key={"head" + index}
              >
                <div className="flex items-center space-x-2">
                  <h1>{col.header}</h1>
                  {orders.some(v => v.column == col.accessor && v.value == "desc")
                    ? <ArrowUp className="w-4 h-4" />
                    : orders.some(v => v.column == col.accessor && v.value == "asc")
                      ? <ArrowDown className="w-4 h-4" />
                      : <> </>
                  }
                </div>
              </TableHead>
            ))}
            <TableHead
              onClick={() => { setCreate(true) }}
              className="text-text font-bold bg-red-400 hover:bg-blue-600 flex justify-center items-center"><PlusCircle /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData?.map((row, rowIndex) => (
            <TableRow key={'row' + rowIndex} className={`${row.id == edit ? "bg-yellow-200" : ""}`}>
              {columns.map((col, colIndex) => {
                let cn : string = "" ; 
                let red : string = "";
                if (col.special_col?.path) {
                  let walk  : any = row ;
                  col.special_col.path.split(".").map(ac => {
                    if (walk != undefined && walk != null)  return walk = walk[ac]
                  })
                  if (walk != undefined && walk != null) {
                    cn = walk ? col.special_col.y_cn : col.special_col.n_cn
                  }
                }
                if (col.special_col?.redirect) {
                  let walk  : any = row ;
                  let [b,a] = col.special_col?.redirect.split('/')
                  a.split(".").map(ac => {
                    if (walk != undefined && walk != null)  return walk = walk[ac]
                  })
                  if (walk != undefined && walk != null) {
                    red = "/admin/"+b+ "/" + walk
                  }
                }
                return (
                <TableCell key={'row' + rowIndex + 'cell' + colIndex} className={cn} 
                onClick={()=>{
                  try {
                  if (col.special_col?.redirect && red.length)  router.push(red)
                  else if (col.special_col?.col_extend) setColExtend(
                    getFormattedCell(col.accessor, row, CellFormat.FALSE, col.type) as string | number
                  )
                  }catch{}
                  }}>
                  <div
                    className={``}
                  >{getFormattedCell(col.accessor, row, col.format, col.type)}</div>
                </TableCell>
              )})}
              <TableCell>
                <button onClick={() => setEdit(row.id)}>
                  <Edit className="w-5 h-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length + 1}>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <label htmlFor="rowsPerPage">Rows per page:</label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="ml-2 p-2 border rounded"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div>
      <button
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="mx-2">
        Page {currentPage} of {totalPagination.totalPages}
      </span>
      <button
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPagination.totalPages))}
        disabled={currentPage === totalPagination.totalPages}
        className="px-4 py-2 mx-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
      >
        Next
      </button>

      {/* New Input and Go Button */}
      <div className="inline-flex items-center mx-2">
        <input
          type="number"
          value={inputPage}
          onChange={handleInputChange}
          className="px-2 py-1 border border-gray-300 rounded"
          placeholder="Go to page"
          min="1"
          max={totalPagination.totalPages}
        />
        <button
          onClick={handleGoToPage}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-800 rounded"
          disabled={!inputPage.length || isNaN(parseInt(inputPage)) || parseInt(inputPage, 10) < 1 || parseInt(inputPage, 10) > totalPagination.totalPages}
        >
          Go
        </button>
      </div>
    </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {edit && (
        <EditModel
          whid={edit}
          setLoading={setPageLoading}
          OnClose={() => {
            handleUpdateRow(edit);
            setEdit(undefined);
          }}
        />
      )}
      {create && (
        <CreateModel
        setLoading={setPageLoading}  
        OnClose={(newRow:any) => {
          if (newRow != null ) handleNewRow(newRow);  
            setCreate(false);
          }}
        />
      )}
      {colExtend && (
        <ColExtendModel
          whid={colExtend}
          setLoading={setPageLoading}
          OnClose={() => {
            setColExtend(false);
          }}
        />
      )}
      {pageloading && <PageLoading/>}
      
    </div>
  );
};

export default DashboardTable;
