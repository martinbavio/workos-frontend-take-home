import { Flex, TextField, Button, Table, Box, Theme } from "@radix-ui/themes";

import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { ICON_SIZE } from "./constants";

// Search Bar
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  addLabel: string;
}

export function SearchBar({
  value,
  onChange,
  onAdd,
  addLabel,
}: SearchBarProps) {
  return (
    <Flex gap="2" mb="5">
      <Box flexGrow="1">
        <TextField.Root
          placeholder="Search..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flexGrow: 1 }}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon {...ICON_SIZE} aria-hidden="true" />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Button onClick={onAdd}>
        <PlusIcon {...ICON_SIZE} aria-hidden="true" />
        {addLabel}
      </Button>
    </Flex>
  );
}

// Table Pagination
interface TablePaginationProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  colSpan: number;
}

export function TablePagination({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  colSpan,
}: TablePaginationProps) {
  return (
    <Theme accentColor="gray" asChild>
      <Table.Row>
        <Table.Cell colSpan={colSpan}>
          <Flex justify="end" gap="2">
            <Button
              variant="outline"
              disabled={!hasPrevious}
              onClick={onPrevious}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!hasNext}
              onClick={onNext}
              aria-label="Next page"
            >
              Next
            </Button>
          </Flex>
        </Table.Cell>
      </Table.Row>
    </Theme>
  );
}
