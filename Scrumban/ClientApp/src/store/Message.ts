export interface Message {
    sendDateTime: Date;
    text: string;
    sender: {
        id: string;
        fullName: string;
    }
}