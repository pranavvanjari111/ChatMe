import mongoose, {Schema, Document} from "mongoose";

export interface IChat extends Document {
    isGroupChat: boolean;
    chatName?: string;
    groupPhoto?: string;
    users: mongoose.Types.ObjectId[];
    admins?: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
}


const ChatSchema: Schema<IChat> = new Schema(
    {
        isGroupChat: {
            type: Boolean,
            default: false,
        },

        chatName: {
            type: String,
            trim: true,
            required: function () {
                return this.isGroupChat;
            },
        },

        groupPhoto: {
            type: String,
            trim: true,
        },

        users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ],

        admins: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        ],

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;