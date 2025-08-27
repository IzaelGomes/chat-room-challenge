import { Flex, Text, Button, HStack, Menu, IconButton } from '@chakra-ui/react';
import {
  FiSun,
  FiMoon,
  FiHash,
  FiUser,
  FiLogOut,
  FiMenu,
} from 'react-icons/fi';
import { useColorMode } from '../ui/color-mode';
import { useAuth, useSignOut } from '../../hooks/useAuth';

interface HeaderProps {
  roomName?: string;
  onMenuClick?: () => void;
}

function Header({ roomName = 'Selecione uma sala', onMenuClick }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: auth } = useAuth();
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <Flex h='full' align='center' justify='space-between' px={4}>
      <HStack>
        {onMenuClick && (
          <IconButton
            aria-label='Abrir menu'
            variant='ghost'
            size='sm'
            onClick={onMenuClick}
            mr={2}
          >
            <FiMenu />
          </IconButton>
        )}
        <FiHash color='gray' />
        <Text
          fontWeight='semibold'
          color='gray.700'
          _dark={{ color: 'gray.300' }}
          fontSize={{ base: 'sm', md: 'md' }}
        >
          {roomName}
        </Text>
      </HStack>

      <HStack gap={{ base: 1, md: 2 }}>
        <Button
          aria-label='Alternar modo escuro'
          variant='ghost'
          onClick={toggleColorMode}
          size={{ base: 'xs', md: 'sm' }}
        >
          {colorMode === 'light' ? <FiMoon /> : <FiSun />}
        </Button>

        {auth && (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant='ghost'
                size={{ base: 'xs', md: 'sm' }}
                aria-label='Menu de usuário'
                display={{ base: 'none', sm: 'flex' }}
              >
                <FiUser style={{ marginRight: '8px' }} />
                <Text display={{ base: 'none', md: 'inline' }}>
                  {auth.user.username}
                </Text>
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
