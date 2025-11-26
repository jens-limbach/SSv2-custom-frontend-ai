export interface Opportunity {
  id: string;
  name: string;
  displayId?: string;
}

export interface Account {
  id: string;
  formattedName: string;
  displayId?: string;
  defaultAddress?: {
    formattedPostalAddressDescription?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  displayId?: string;
}

export interface Employee {
  id: string;
  formattedName: string;
  displayId?: string;
}

export interface ServiceCase {
  id: string;
  subject: string;
  displayId?: string;
}

export interface CrmEntitiesResponse<T> {
  value: T[];
}
