import { IUserRepository } from "../../../../core/ports/user.repository";
import { User } from "../../../../core/domain/user";
import { UserModel, IUserDocument } from "./user.model"; // Import IUserDocument here
import { OrganizationModel } from "./organization.model";
import mongoose from "mongoose";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).lean();
    if (!userDoc) return null;

    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      organizationId: userDoc.organizationId.toString(),
      roles: userDoc.roles as any,
      createdAt: userDoc.createdAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id).lean();
    if (!userDoc) return null;
    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      organizationId: userDoc.organizationId.toString(),
      roles: userDoc.roles as any,
      createdAt: userDoc.createdAt,
    };
  }

  async createWithOrganization(
    userDetails: Omit<User, "id" | "createdAt">,
    orgName: string
  ): Promise<User> {
    // Explicitly declare the type of createdUserDoc
    let createdUserDoc: IUserDocument;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const org = new OrganizationModel({ name: orgName });
      const savedOrg = await org.save({ session });

      const user = new UserModel({
        ...userDetails,
        organizationId: savedOrg._id,
      });
      createdUserDoc = await user.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    if (!createdUserDoc) {
      throw new Error("User creation failed.");
    }

    return {
      id: createdUserDoc._id.toString(),
      name: createdUserDoc.name,
      email: createdUserDoc.email,
      passwordHash: createdUserDoc.passwordHash,
      organizationId: createdUserDoc.organizationId.toString(),
      roles: createdUserDoc.roles as any,
      createdAt: createdUserDoc.createdAt,
    };
  }
}
