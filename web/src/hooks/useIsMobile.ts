import { useBreakpointValue } from '@chakra-ui/react';

export function useIsMobile() {
  const isMobile = useBreakpointValue({
    'base': true,
    'sm': true,
    'md': false,
    'lg': false,
    'xl': false,
    '2xl': false,
  });

  return isMobile || false;
}
