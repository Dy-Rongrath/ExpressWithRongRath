import { Project } from "../domain/project";

export interface IProjectRepository {
  create(project: Omit<Project, "id" | "createdAt">): Promise<Project>;
}
