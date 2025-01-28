import { Status } from "@/enums/status-type.enum";
import { UserType } from "@/enums/user-type.enum";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  primaryPhoneNumber: string;
  status: Status;
  userType: UserType;
  accessToken: string;
}
