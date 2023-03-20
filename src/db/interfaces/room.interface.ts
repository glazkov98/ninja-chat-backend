export interface Room {
    id: string;
    name: string;
    type?: string;
    owner?: string;
    members?: string[] | null;
    isDeleted?: boolean;
}