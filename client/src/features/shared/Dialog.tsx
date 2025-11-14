import { Dialog as RadixDialog } from "@radix-ui/themes";
import { DialogFormField, DialogFormFieldLabel } from "./components";

// Export Dialog as a namespace with all Radix Dialog parts + FormField
export const Dialog = {
  Root: RadixDialog.Root,
  Trigger: RadixDialog.Trigger,
  Content: RadixDialog.Content,
  Title: RadixDialog.Title,
  Description: RadixDialog.Description,
  Close: RadixDialog.Close,
  FormField: DialogFormField,
  FormLabel: DialogFormFieldLabel,
};
