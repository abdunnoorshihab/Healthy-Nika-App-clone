import {User} from './user.interface';


export interface Notification {
  _id?: string;
  requestTo?: string | User;
  user?: string | any;
  selectedQty?: number;
  expireDays?: number;
  name?: string;
  priceId?: string;
  expireDate?: string;
  expireTime?: string;
  unit?: string;
  size?: string;
  status?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
  unitValue?: any;
  select?: boolean;
  isReads?: boolean;
  isSelected?: boolean;
}
