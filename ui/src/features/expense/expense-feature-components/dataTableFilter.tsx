import type { Column } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableFilterProps<TData> {
  column: Column<TData, unknown>;
  title: string;
}
export function DataTableFilter<TData>({
  column,
  title,
}: DataTableFilterProps<TData>) {
  const options = Array.from(
    column.getFacetedUniqueValues()?.keys() || [],
  ) as string[];
  const filterValue = column.getFilterValue() as string[] | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-1 h-8 data-[state=open]:bg-accent"
        >
          {title}
          {filterValue && filterValue.length > 0 && (
            <span className="ml-1 text-xs font-bold opacity-70">
              ({filterValue.length})
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        {filterValue && filterValue.length > 0 && (
          <DropdownMenuItem
            onClick={() => column.setFilterValue(undefined)}
            className="text-red-500"
          >
            Clear Filter
          </DropdownMenuItem>
        )}

        {options.map((option) => {
          const isSelected = filterValue?.includes(option);

          return (
            <DropdownMenuCheckboxItem
              key={option}
              checked={isSelected}
              onCheckedChange={(checked) => {
                let newFilterValue = filterValue ? [...filterValue] : [];

                if (checked) {
                  newFilterValue.push(option);
                } else {
                  newFilterValue = newFilterValue.filter(
                    (val) => val !== option,
                  );
                }
                column.setFilterValue(
                  newFilterValue.length > 0 ? newFilterValue : undefined,
                );
              }}
            >
              {option}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
