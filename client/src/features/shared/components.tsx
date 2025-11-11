import {
  Flex,
  TextField,
  Button,
  Table,
  Box,
  Theme,
  DropdownMenu,
  IconButton,
} from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";

import {
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { ICON_SIZE } from "./constants";
import type { ActionsMenuItem } from "./types";

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

interface ActionsMenuProps {
  title: string;
  items: ActionsMenuItem[];
}

export function ActionsMenu({ title, items }: ActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" size="1" aria-label={title}>
          <DotsHorizontalIcon {...ICON_SIZE} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {items.map((item) => (
          <DropdownMenu.Item onSelect={item.action}>
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

interface DialogFormFieldProps extends React.PropsWithChildren {
  label?: string;
  id?: string;
}

export function DialogFormField({ id, label, children }: DialogFormFieldProps) {
  return (
    <Flex direction="column" gap="1">
      {label && (
        <Label.Root className="label" htmlFor={id}>
          {label}
        </Label.Root>
      )}
      {children}
    </Flex>
  );
}
