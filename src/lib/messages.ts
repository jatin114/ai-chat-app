import { db } from "./firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    // DocumentData,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { Message } from "../types/message";

const messagesRef = collection(db, "messages");

/**
 * Send a message to the "messages" collection.
 * Returns the created document id.
 */
export const sendMessage = async (
    text: string,
    senderId: string,
    senderName: string,
    type: string = "direct"
): Promise<string> => {
    if (!text || !text.trim()) {
        throw new Error("Message text is empty");
    }

    const docRef = await addDoc(messagesRef, {
        text: text.trim(),
        senderId,
        senderName,
        type,
        createdAt: serverTimestamp(), // server-side timestamp
    });

    // Note: serverTimestamp is set by Firestore on the server. The onSnapshot listener
    // will later deliver the actual timestamp to clients. Here we return the doc id.
    return docRef.id;
};

/**
 * Subscribe to messages (real-time). Callback receives an array of typed Message objects.
 * Returns the unsubscribe function.
 */
export const subscribeMessages = (
    callback: (messages: Message[]) => void
): (() => void) => {
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: Message[] = snapshot.docs.map((doc) => {
            const data = doc.data() as DocumentData;

            // Normalize createdAt to epoch ms. If createdAt is not yet available,
            // fallback to current time (it will update when serverTimestamp resolves).
            const createdAt =
                data.createdAt && typeof data.createdAt.toDate === "function"
                    ? data.createdAt.toDate().getTime()
                    : Date.now();

            return {
                id: doc.id,
                text: data.text ?? "",
                senderId: data.senderId ?? "",
                senderName: data.senderName ?? "Unknown",
                createdAt,
                type: data.type ?? "direct",
            } as Message;
        });

        callback(msgs);
    });

    return unsubscribe;
};
