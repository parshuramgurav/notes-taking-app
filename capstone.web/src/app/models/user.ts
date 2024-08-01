export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    passwordHash?: string; // Optional for update cases
    role: string;
}
