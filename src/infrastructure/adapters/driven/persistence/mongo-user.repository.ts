import { IUserRepository } from "../../../../core/ports/user.repository";
import { User } from "../../../../core/domain/user";
import { UserModel } from "./user.model";
import { OrganizationModel } from "./organization.model";
import mongoose from "mongoose";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).lean();
    if (!userDoc) return null;
    // Note: Manually mapping to the domain entity
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
    let createdUserDoc;
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
