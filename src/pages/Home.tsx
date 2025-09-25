import { useState } from "react";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext"
import { auth } from "../lib/firebase";
import { useChat } from "../hooks/useChat";
import { formatRelativeTime } from "../utils/formatDate";
import { Button } from "@/components/ui/button";

const Home = () => {
    const { user } = useAuth();
    const { messages, send } = useChat();
    const [text, setText] = useState("");

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            await send(text); // no need to pass user.uid, handled in hook
            setText("");
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    // const formatTime = (timestamp: number) => {
    //     const date = new Date(timestamp);
    //     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // };

    // Helper: group messages by consecutive sender
    const groupedMessages: { senderId: string; senderName: string; msgs: any[] }[] = [];
    let lastSender: string | null = null;

    for (const msg of messages) {
        if (msg.senderId === lastSender) {
            groupedMessages[groupedMessages.length - 1].msgs.push(msg);
        } else {
            groupedMessages.push({
                senderId: msg.senderId,
                senderName: msg.senderId === user?.uid ? "You" : msg.senderName || "Unknown",
                msgs: [msg],
            });
            lastSender = msg.senderId;
        }
    }

    return (
        <div>
            <div className="flex flex-col h-screen">
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 border-b">
                    {groupedMessages.map((group, idx) => (
                        <div key={idx} className="mb-4">
                            <strong className="text-blue-600">{group.senderName}</strong>
                            <div className="ml-4">
                                {group.msgs.map((m) => (
                                    <div key={m.id} className="text-gray-800">
                                        {m.text}
                                        <span className="text-gray-500 text-sm ml-2">
                                            {m.createdAt ? formatRelativeTime(m.createdAt) : ""}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input box */}
                <div className="p-4 flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border rounded p-2"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-500 text-white px-4 rounded"
                    >
                        Send
                    </button>
                </div>
            </div>
            <button onClick={() => signOut(auth)}>Logout</button>
            <Button>Button</Button>
        </div>
    )
}

export default Home