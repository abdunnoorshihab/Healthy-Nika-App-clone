
import {User} from './user.interface';


export interface Request {
  _id?: string;
  requestTo?: string | User;
  user?: string | any;
  selectedQty?: number;
  name?: string;
  priceId?: string;
  unit?: string;
  expireDate?: string;
  expireTime?: string;
  status?: string;
  userViewCount?: number;
  requestToViewCount?: number;
  size?: string;
  color?: string;
  requestToInfo?: any;
  userInfo?: any;
  createdAt?: Date;
  updatedAt?: Date;
  unitValue?: any;
  select?: boolean;
}
