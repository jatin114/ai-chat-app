export interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    createdAt: number;
    type?: "direct" | "group" | "ai";
}