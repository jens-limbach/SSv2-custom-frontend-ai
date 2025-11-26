export interface CostOfSample {
  content: string;
  currencyCode: string;
  id?: string;
}

export interface NumberOfSamples {
  content: number;
  id?: string;
  uomCode: string;
}

export interface Account {
  accountId: string;
  name?: string;
  displayId?: string;
}

export interface Product {
  productId: string;
  name?: string;
  displayId?: string;
}

export interface Employee {
  employeeId: string;
  name?: string;
  displayId?: string;
}

export interface Opportunity {
  opportunityId: string;
  id?: string;
  name?: string | null;
  displayId?: string | null;
}

export interface ServiceCase {
  serviceCaseId: string;
  id?: string;
  name?: string | null;
  displayId?: string | null;
}

export interface Note {
  note: string;
}

export interface Sample {
  id?: string;
  sampleName: string;
  packagingHeight?: string | null;
  packagingWidth?: string | null;
  packagingMaterial?: string | null;
  costOfSample: CostOfSample;
  notes?: Note[];
  dueDate: string;
  hazardous: boolean;
  hazardousReason?: string;
  numberOfSamples: NumberOfSamples;
  sampleType: string;
  shipToAddress: string;
  status: string;
  account: Account;
  product: Product;
  employee: Employee;
  serviceCase?: ServiceCase | null;
  opportunity?: Opportunity | null;
  overdueStatusIcon?: string;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  account_id?: string;
  product_id?: string;
  employee_id?: string;
  serviceCase_id?: string | null;
  opportunity_id?: string | null;
  costOfSample_id?: string;
  numberOfSamples_id?: string;
}

export interface SampleResponse {
  '@odata.context': string;
  value: Sample[];
}

export interface CreateSamplePayload {
  sampleName: string;
  packagingHeight?: string;
  packagingMaterial?: string;
  packagingWidth?: string;
  costOfSample: {
    currencyCode: string;
    content: number | string;
  };
  notes?: Array<{ note: string }>;
  dueDate: string;
  hazardous: boolean;
  hazardousReason?: string;
  numberOfSamples: {
    content: number | string;
    uomCode: string;
  };
  sampleType: string;
  shipToAddress: string;
  status: string;
  account: {
    accountId: string;
  };
  product: {
    productId: string;
  };
  employee: {
    employeeId: string;
  };
  serviceCase?: {
    serviceCaseId: string;
  };
  opportunity?: {
    opportunityId: string;
  };
}
