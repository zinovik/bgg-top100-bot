export interface MessengerService {
    sendMessage({
        chatId,
        text,
    }: {
        chatId: string;
        text: string;
    }): Promise<void>;
}
