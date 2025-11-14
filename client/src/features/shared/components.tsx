import {
  Flex,
  TextField,
  Button,
  Table,
  Box,
  Theme,
  DropdownMenu,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { Label } from "radix-ui";

import {
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { ICON_SIZE } from "./constants";
import type { ActionsMenuItem, DialogFieldContextProps } from "./types";
import { useId, type ReactNode } from "react";
import { DialogFieldContext, useDialogFieldContext } from "./hooks";

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
              <Text weight="medium">Previous</Text>
            </Button>
            <Button
              variant="outline"
              disabled={!hasNext}
              onClick={onNext}
              aria-label="Next page"
            >
              <Text weight="medium">Next</Text>
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
          <DropdownMenu.Item key={item.label} onSelect={item.action}>
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export function DialogFormField({
  children,
}: {
  children:
    | React.ReactNode
    | ((props: DialogFieldContextProps) => React.ReactNode);
}) {
  const id = useId();
  const contextValue = { id };

  return (
    <Flex direction="column" gap="1">
      <DialogFieldContext value={contextValue}>
        {typeof children === "function" ? children(contextValue) : children}
      </DialogFieldContext>
    </Flex>
  );
}

interface DialogFormFieldLabelProps {
  children: ReactNode;
  noStyles?: boolean;
}
export function DialogFormFieldLabel({
  children,
  noStyles,
}: DialogFormFieldLabelProps) {
  const { id } = useDialogFieldContext();
  return (
    <Label.Root
      htmlFor={id}
      style={
        noStyles
          ? {}
          : {
              fontWeight: "bold",
              fontSize: 12,
            }
      }
    >
      {children}
    </Label.Root>
  );
}
