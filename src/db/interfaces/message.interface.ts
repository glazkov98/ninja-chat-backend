export interface Message {
    id: string;
    room: string;
    content: string;
    location?: string | null;
    share?: boolean;
    userId: string;
    nickname: string;
    read: boolean;
    createdAt: string;
}