export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
  location: string;
  address: string;
  created_at: string;
}

export interface Message {
  uid: string;
  text: string;
  read: boolean;
  created_at: string;
}

export interface Notification {
  uid: string;
  text: string;
  created_at: string;
  seen: number;
}

export interface FriendRequest {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
  address: string;
  created_at: string;
}
