import { Flex, Text, Button, HStack } from '@chakra-ui/react';
import { FiSun, FiMoon, FiHash } from 'react-icons/fi';
import { useColorMode } from '../ui/color-mode';

interface HeaderProps {
  roomName?: string;
}

function Header({ roomName = 'Selecione uma sala' }: HeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode();

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
      </HStack>
    </Flex>
  );
}

export default Header;
