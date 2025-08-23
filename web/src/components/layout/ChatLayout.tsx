import { Box, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface ChatLayoutProps {
  children: ReactNode;
  roomName?: string;
}

function ChatLayout({ children, roomName }: ChatLayoutProps) {
  return (
    <Flex h='100vh' bg='gray.50' _dark={{ bg: 'gray.900' }}>
      <Box
        w='280px'
        bg='gray.100'
        borderRight='1px'
        borderColor='gray.200'
        _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
      >
        <Sidebar />
      </Box>

      <Flex flex='1' direction='column'>
        <Box
          h='60px'
          bg='white'
          borderBottom='1px'
          borderColor='gray.200'
          _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        >
          <Header roomName={roomName} />
        </Box>

        <Box flex='1' overflow='hidden'>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

export default ChatLayout;
