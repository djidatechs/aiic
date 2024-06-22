"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table"; 
import { cn } from "@/lib/utils"; 
import { CellType, FilterCriteria, OrderCriteria, TableProps } from "@/types/types";
import { getFormattedCell } from "@/lib/functions";
import { ArrowDown, ArrowUp } from "lucide-react";

const DashboardTable = <T extends { id: string | number }>({ columns, fetchData, updateData }: TableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [orders, setOrders] = useState<OrderCriteria[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditing, setIsEditing] = useState<Record<string | number, boolean>>({});
  const [editedData, setEditedData] = useState<any>({});
  const [filters, setFilters] = useState<FilterCriteria[]>([]);

  useEffect(() => {
    loadData();
  }, [currentPage, rowsPerPage, filters,orders]);

  const loadData = async () => {
    const response = await fetchData({ orders , page: currentPage, limit: rowsPerPage, filters });
    setData(response.data);
    setFilteredData(response.data);
  };

  const handleEdit = (rowId: string | number, field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async () => {
    await updateData(Object.values(editedData));
    setIsEditing({});
    loadData(); // Reload data after update
  };

  const handleFilterChange = (index: number, e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = [...prev];
      newFilters[index] = { ...newFilters[index], [name]: value };
      return newFilters;
    });
  };

  const handleSetOrders = (column: string,type:CellType) => {
    
    setOrders((orders:any) => {
      let exist = false;
      const newOrders = orders.map((order:any) => {
        if (order.column === column) {
          exist = true;
          return {
            column: order.column,
            value: order.value === "desc" ? "asc" : order.value == "asc" ? null : "desc",
          };
        }
        return order;
      });
      if (!exist) newOrders.push({ column, value: "desc" })
      return newOrders;
    });
  };
  
  const handleAddFilter = () => {
    setFilters((prev) => [...prev, { column: "", value: "", condition: "exact" }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    loadData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-white rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          {filters.map((filter, index) => (
            <div key={index} className="mb-2">
              <label>
                Column:
                <select
                  name="column"
                  value={filter.column}
                  onChange={(e) => handleFilterChange(index, e)}
                  className="ml-2"
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
                  onChange={(e) => handleFilterChange(index, e)}
                  className="ml-2"
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
                  onChange={(e) => handleFilterChange(index, e)}
                  className="ml-2"
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
            Apply
          </button>
        </div>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="select-none bg-red-500  hover:bg-red-500 cursor-pointer ">
            {columns.map((col, index) => (
              <TableHead
              onClick={()=>handleSetOrders(col.accessor,col.type)}
              className=" text-white font-semibold  hover:bg-red-700 transition duration-150 "
              key={"head" + index}>
                <div className="flex items-center space-x-2">
                <h1>{col.header}</h1>
                {orders.some(v=>v.column == col.header && v.value=="desc")
                ?<ArrowDown className="w-4 h-4"/> 
                : orders.some(v=>v.column == col.header && v.value=="asc")
                ? <ArrowUp className="w-4 h-4"/>
                : <> </>
                }
                </div>
                
              </TableHead>
            ))}
            <TableHead className="text-white font-bold">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData?.map((row, rowIndex) => (
            <TableRow key={'row' + rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={'row' + rowIndex + 'cell' + colIndex}>
                  <input
                    type="text"
                    disabled={!isEditing[row.id]}
                    value={getFormattedCell(col.accessor, row, col.format,col.type)}
                    onChange={(e) => handleEdit(row.id, col.accessor, e.target.value)}
                    className={isEditing[row.id] ? "border px-2 py-1" : "bg-transparent"}
                  />
                </TableCell>
              ))}
              <TableCell>
                <button onClick={() => setIsEditing((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}>
                  <i className="fas fa-edit"></i> {/* Font Awesome edit icon */}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length + 1}>
              <div className="flex justify-between items-center">
                <div>
                  Showing {1 + (currentPage - 1) * rowsPerPage} to{" "}
                  {Math.min(currentPage * rowsPerPage, filteredData?.length || 0)} of {filteredData?.length || 0} entries
                </div>
                <div>
                  {Array.from({ length: Math.ceil((filteredData?.length || 0) / rowsPerPage) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={cn(
                        "px-4 py-2 border rounded-md mx-1",
                        currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div>
                  Rows per page:
                  <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="ml-2">
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default DashboardTable;
