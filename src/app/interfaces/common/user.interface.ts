

export interface User {
  _id?: string;
  name?: string;
  fullName?: string
  parentPhone?: string
  maritalStatus?: string
  userId?: string
  otherProfession?: string
  otherPartnerProfession?: string
  hijab?: string
  unsuccess?: any
  expired?: any
  educationLevel?: string
  partnerProfession?: string
  additionalInformation?: string
  islamicPractice?: string
  secondEthnicity?: string
  selfSummery?: string
  pauseStatus?: string
  countryCode?: string
  pauseNote?: string
  profession?: string
  cityzenShip?: string
  countryCode1?: string
  ethnicity?: string
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  credit?: number;
  requests?: any;
  username?: string;
  countryOfResidence?: string;
  cityOfResidence?: string;
  phoneNo?: string;
  email?: string;
  height?: any;
  dateOfBirth?: string;
  age?: string;
  password?: string;
  gender?: string;
  profileImg?: any;
  registrationType?: string;

  hides?: string | User[] | any;

  hasAccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  success?: boolean;
  userFrom?:string;
  aboutMe?:string;


  rewardPoints?: number;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredInDays?: string;
  data?: any;
  message?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
}
