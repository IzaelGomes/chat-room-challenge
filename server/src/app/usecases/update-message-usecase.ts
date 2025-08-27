import { MessageRepositoryInterface } from '../repository/message-repository-interface';
import { AppError } from '../error/app-error';

type UpdateMessageRequest = {
  messageId: string;
  content: string;
  userId: string;
};

type UpdateMessageResponse = {
  message: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    roomId: string;
    userId: string;
    user?: {
      id: string;
      username: string;
    };
  };
};

export class UpdateMessageUseCase {
  constructor(private messageRepository: MessageRepositoryInterface) {}

  async execute({
    messageId,
    content,
    userId,
  }: UpdateMessageRequest): Promise<UpdateMessageResponse> {
    const message = await this.messageRepository.findMessageById(messageId);

    if (!message) {
      throw new AppError('Mensagem não encontrada', 404);
    }

    if (!content || content.trim().length === 0) {
      throw new AppError('O conteúdo da mensagem não pode estar vazio', 400);
    }

    if (message.userId !== userId) {
      throw new AppError(
        'Você não tem permissão para atualizar esta mensagem',
        403
      );
    }

    const messageUpdated = await this.messageRepository.updateMessage(
      messageId,
      content
    );

    return { message: messageUpdated };
  }
}
