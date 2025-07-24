import { Schema, model, Document } from "mongoose";

export interface IOrganizationDocument extends Document {
  name: string;
}

const organizationSchema = new Schema<IOrganizationDocument>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const OrganizationModel = model<IOrganizationDocument>(
  "Organization",
  organizationSchema
);
