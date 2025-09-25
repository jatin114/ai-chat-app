import { formatDistanceToNow } from "date-fns";

export const formatRelativeTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
