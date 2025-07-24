import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/types";
import { MongoProjectRepository } from "../../../driven/persistence/mongo-project.repository";
import { CreateProjectUseCase } from "../../../../../core/use-cases/create-project.use-case";

const projectRepository = new MongoProjectRepository();
const createProjectUseCase = new CreateProjectUseCase(projectRepository);

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name, description } = req.body;
    const organizationId = req.user?.organizationId; // Get org ID from the user's token

    if (!organizationId) {
      return res
        .status(400)
        .json({ message: "Organization ID not found in token." });
    }

    const project = await createProjectUseCase.execute({
      name,
      description,
      organizationId,
    });
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
