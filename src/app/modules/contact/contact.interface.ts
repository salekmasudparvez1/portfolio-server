export interface IContact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isScheduling: boolean;
  meetingDate?: string;
  meetingTime?: string;
  status?: "pending" | "responded" | "scheduled" | "completed";
  
  createdAt?: Date;
  updatedAt?: Date;
}
