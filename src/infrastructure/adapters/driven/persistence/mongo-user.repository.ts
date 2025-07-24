import { IUserRepository } from "../../../../core/ports/user.repository";
import { User } from "../../../../core/domain/user";
import { UserModel, IUserDocument } from "./user.model";
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
    let createdUserDoc: IUserDocument | undefined;
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

  async findOrCreate(userDetails: {
    email: string;
    name: string;
    googleId: string;
  }): Promise<User> {
    // Try to find the user by their Google ID first
    let userDoc = await UserModel.findOne({
      googleId: userDetails.googleId,
    }).lean();
    if (userDoc) {
      // User exists, map and return
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

    // If not found by Google ID, check by email (maybe they signed up traditionally)
    userDoc = await UserModel.findOne({ email: userDetails.email }).lean();
    if (userDoc) {
      // User exists, link their Google ID and return
      userDoc = await UserModel.findByIdAndUpdate(
        userDoc._id,
        { $set: { googleId: userDetails.googleId } },
        { new: true }
      ).lean();
      if (!userDoc) {
        throw new Error("User not found after updating Google ID.");
      }
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

    // If user does not exist at all, create them and a new organization
    const session = await mongoose.startSession();
    let createdUserDoc: IUserDocument | undefined = undefined;
    try {
      await session.withTransaction(async () => {
        const org = new OrganizationModel({
          name: `${userDetails.name}'s Organization`,
        });
        const savedOrg = await org.save({ session });

        const user = new UserModel({
          googleId: userDetails.googleId,
          email: userDetails.email,
          name: userDetails.name,
          passwordHash: "", // No password for OAuth users
          organizationId: savedOrg._id,
          roles: ["Org Admin"],
        });
        createdUserDoc = await user.save({ session });
      });
    } finally {
      session.endSession();
    }

    if (!createdUserDoc) {
      throw new Error("Could not create user with Google profile.");
    }
    // Type assertion to ensure correct type
    const userDocTyped = createdUserDoc as IUserDocument;
    return {
      id: userDocTyped._id.toString(),
      name: userDocTyped.name,
      email: userDocTyped.email,
      passwordHash: userDocTyped.passwordHash,
      organizationId: userDocTyped.organizationId.toString(),
      roles: userDocTyped.roles as any,
      createdAt: userDocTyped.createdAt,
    };
  }
}
