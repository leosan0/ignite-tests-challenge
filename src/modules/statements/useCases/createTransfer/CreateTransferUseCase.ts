import { container, inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { OperationType } from "../../entities/Statement";

interface IRequest {
  amount: number;
  description: string;
  sender_id: string;
  receiver_id: string;
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ amount, description, sender_id, receiver_id }: IRequest) {
    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new AppError("Sender user not found");
    }

    const receiver = await this.usersRepository.findById(receiver_id);

    if (!receiver) {
      throw new AppError("Receive user not found");
    }

    const sender_balance = await this.statementsRepository.getUserBalance({
      user_id: sender_id
    });

    if (amount > sender_balance.balance) {
      throw new AppError("Amount must be greater than 0");
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount,
      description: `Transfer to ${receiver.name}: ${description}`
    });

    const transfer_statement = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id: sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return transfer_statement;

  }
}

export { CreateTransferUseCase };
