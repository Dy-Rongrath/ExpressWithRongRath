import { Schema, model, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  organizationId: Schema.Types.ObjectId;
  roles: string[];
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    roles: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>("User", userSchema);
