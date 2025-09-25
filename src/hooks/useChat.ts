import { useEffect, useState } from "react";
import { sendMessage, subscribeMessages } from "../lib/messages";
import type { Message } from "../types/message";
import { useAuth } from "../context/AuthContext";

export function useChat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeMessages(setMessages);
        return () => unsubscribe();
    }, []);

    const send = async (text: string) => {
        if (!user) throw new Error("Not authenticated");
        await sendMessage(text, user.uid, user.displayName ?? "Anonymous");
    };

    return { messages, send };
}
