import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export function DataTable({
  data,
  columns,
  onRowSelect,
  sortColumn,
  sortDirection,
  onSort,
}) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {onRowSelect && (
              <TableHead className="w-10">
                <Checkbox />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.sortable ? "cursor-pointer" : ""}
                onClick={
                  column.sortable && onSort
                    ? () => onSort(column.id)
                    : undefined
                }
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && sortColumn === column.id && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              {onRowSelect && (
                <TableCell className="p-4">
                  <Checkbox
                    onCheckedChange={(checked) =>
                      onRowSelect(item, checked)
                    }
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.id}>{column.cell(item)}</TableCell>
              ))}
              <TableCell className="text-right">
                <button className="text-gray-400 hover:text-gray-700">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}