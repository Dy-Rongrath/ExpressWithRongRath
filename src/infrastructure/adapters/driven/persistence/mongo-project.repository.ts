import { IProjectRepository } from "../../../../core/ports/project.repository";
import { Project } from "../../../../core/domain/project";
import { ProjectModel } from "./project.model";

export class MongoProjectRepository implements IProjectRepository {
  async create(
    projectDetails: Omit<Project, "id" | "createdAt">
  ): Promise<Project> {
    const projectDoc = new ProjectModel(projectDetails);
    const savedDoc = await projectDoc.save();
    return {
      id: savedDoc._id.toString(),
      name: savedDoc.name,
      description: savedDoc.description,
      organizationId: savedDoc.organizationId.toString(),
      createdAt: savedDoc.createdAt,
    };
  }
}
