export type QueryStatus = 
  | "pending"
  | "in_process"
  | "completed"
  | "reclassified"
  | "elevated"
  | "info_requested";

export interface Query {
  id: string;
  ritm: string;
  typology: string;
  entryDate: Date;
  deadline: Date;
  isUrgent: boolean;
  assignedLawyer?: string;
  assignedLawyerEmail?: string;
  status: QueryStatus;
  lastAction?: string;
  officeName?: string;
}
