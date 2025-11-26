export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

/**
 * Convierte un User a UserDTO (sin password)
 */
export const toUserDTO = (user: User): UserDTO => {
  return {
    id: user.id!,
    name: user.name,
    email: user.email,
    created_at: user.created_at!,
  };
};