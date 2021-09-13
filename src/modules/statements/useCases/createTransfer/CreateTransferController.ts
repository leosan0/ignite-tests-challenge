import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      amount,
      description,
      sender_id,
      receiver_id
    });

    return response.status(201).json(transfer);
  }
}

export { CreateTransferController };
