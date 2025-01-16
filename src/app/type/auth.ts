export type user = {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  email: string;
  password: string;
  role: string;
  orderHistory: any[];
  avatar: string;
  status: 'active' | 'inactive';
}
