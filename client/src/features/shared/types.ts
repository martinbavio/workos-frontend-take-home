export interface PagedData<T> {
  data: T[];
  next: number | null;
  prev: number | null;
  pages: number;
}

export type TabValue = "users" | "roles";

export type ActionsMenuItem = {
  label: string;
  action: () => void;
};

export interface DialogFieldContextProps {
  id: string;
}
