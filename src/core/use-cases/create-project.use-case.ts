import { Project } from "../domain/project";
import { IProjectRepository } from "../ports/project.repository";

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(input: {
    name: string;
    description: string;
    organizationId: string;
  }): Promise<Project> {
    if (!input.name || !input.organizationId) {
      throw new Error("Project name and organization ID are required.");
    }

    const project = await this.projectRepository.create({
      name: input.name,
      description: input.description,
      organizationId: input.organizationId,
    });

    return project;
  }
}
