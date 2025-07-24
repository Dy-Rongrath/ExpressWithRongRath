import { Schema, model, Document } from "mongoose";

export interface IProjectDocument extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  organizationId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProjectDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

export const ProjectModel = model<IProjectDocument>("Project", projectSchema);
