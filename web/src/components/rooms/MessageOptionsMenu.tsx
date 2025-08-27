import React from 'react';
import { Button, Menu, Portal } from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';

interface MessageOptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

function MessageOptionsMenu({ onEdit, onDelete }: MessageOptionsMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant='outline' size='sm'>
          <FiMoreVertical />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value='edit' onClick={onEdit}>
              Editar
            </Menu.Item>
            <Menu.Item value='delete' onClick={onDelete}>
              Deletar
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export default React.memo(MessageOptionsMenu);
