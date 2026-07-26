export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface UserAuthSession {
  user: User | null;
  isAuthenticated: boolean;
}
