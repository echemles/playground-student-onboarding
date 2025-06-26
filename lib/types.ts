export interface Student {
  id: string;
  name: string;
  email: string;
  contact: string;
}

export interface Column {
  id: string;
  title: string;
  studentIds: string[];
}

export interface BoardData {
  students: { [key: string]: Student };
  columns: { [key: string]: Column };
  columnOrder: string[];
}
