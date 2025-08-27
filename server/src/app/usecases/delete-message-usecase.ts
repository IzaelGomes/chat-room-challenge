import { MessageRepositoryInterface } from '../repository/message-repository-interface';
import { AppError } from '../error/app-error';

type DeleteMessageRequest = {
  messageId: string;
  userId: string;
};

export class DeleteMessageUseCase {
  constructor(private messageRepository: MessageRepositoryInterface) {}

  async execute({ messageId, userId }: DeleteMessageRequest): Promise<void> {
    const message = await this.messageRepository.findMessageById(messageId);

    if (!message) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    if (message.userId !== userId) {
      throw new AppError(
        'Você não tem permissão para deletar esta mensagem',
        403
      );
    }

    await this.messageRepository.deleteMessage(messageId);
  }
}
