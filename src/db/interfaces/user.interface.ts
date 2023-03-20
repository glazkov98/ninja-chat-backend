export interface User {
    id: string;
    googleId?: string | null;
    facebookId?: string | null;
    lastCoords?: string | null;
    createdAt?: string;
}