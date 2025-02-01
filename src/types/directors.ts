export interface IDirector {
  _id: string;
  name: string;
  email: string;
  primaryPhone: string;
  secondaryPhone?: string;
  sharePercentage: number;
}
