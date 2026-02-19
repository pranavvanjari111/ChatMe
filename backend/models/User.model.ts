import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
    name: string;
    phoneNumber: string;
    password: string;
    about?: string;
    profilePhoto?: string;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        about: {
            type: String,
            default: "Hey there! I am using ChatMe",
            trim: true,
        },

        profilePhoto: {
            type: String,
            trim: true,
        },

        lastSeen: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;