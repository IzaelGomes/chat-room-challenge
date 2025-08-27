import { Box, Flex, Drawer, Portal } from '@chakra-ui/react';
import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ChatLayoutProps {
  children: ReactNode;
  roomName?: string;
}

function ChatLayout({ children, roomName }: ChatLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpen = () => setIsOpen(true);

  return (
    <Flex h='100vh' bg='gray.50' _dark={{ bg: 'gray.900' }}>
      {!isMobile && (
        <Box
          w='280px'
          bg='gray.100'
          borderRight='1px'
          borderColor='gray.200'
          _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        >
          <Sidebar />
        </Box>
      )}

      {isMobile && (
        <Drawer.Root
          open={isOpen}
          onOpenChange={(e) => setIsOpen(e.open)}
          size='xs'
          placement='start'
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.CloseTrigger />
                <Box>
                  <Sidebar />
                </Box>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      )}

      <Flex flex='1' direction='column'>
        <Box
          h='60px'
          bg='white'
          borderBottom='1px'
          borderColor='gray.200'
          _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        >
          <Header
            roomName={roomName}
            onMenuClick={isMobile ? handleOpen : undefined}
          />
        </Box>

        <Box flex='1' overflow='hidden'>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

export default ChatLayout;
