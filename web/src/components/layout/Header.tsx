import { Flex, Text, Button, HStack, Menu } from '@chakra-ui/react';
import { FiSun, FiMoon, FiHash, FiUser, FiLogOut } from 'react-icons/fi';
import { useColorMode } from '../ui/color-mode';
import { useAuth, useSignOut } from '../../hooks/useAuth';

interface HeaderProps {
  roomName?: string;
}

function Header({ roomName = 'Selecione uma sala' }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: auth } = useAuth();
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <Flex h='full' align='center' justify='space-between' px={4}>
      <HStack>
        <FiHash color='gray' />
        <Text
          fontWeight='semibold'
          color='gray.700'
          _dark={{ color: 'gray.300' }}
        >
          {roomName}
        </Text>
      </HStack>

      <HStack>
        <Button
          aria-label='Alternar modo escuro'
          variant='ghost'
          onClick={toggleColorMode}
          size='sm'
        >
          {colorMode === 'light' ? <FiMoon /> : <FiSun />}
        </Button>

        {auth && (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant='ghost' size='sm' aria-label='Menu de usuário'>
                <FiUser style={{ marginRight: '8px' }} />
                {auth.user.username}
              </Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item value='logout' onClick={handleSignOut} color='red.500'>
                <FiLogOut style={{ marginRight: '8px' }} />
                Sair
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        )}
      </HStack>
    </Flex>
  );
}

export default Header;
