export interface csvRecords {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: number;
  org_id: number;
  address: string;
  ref_userId: string;
  profilePic: string;
  userData?: object;
}

export interface CsvMappingInterface {
  firstName: string[];
  lastName: string[];
  email: string[];
  username: string[];
  role: string[];
  orgId: string[];
  address: string[];
  ref_userId: string[];
  profilePic: string[];
}
