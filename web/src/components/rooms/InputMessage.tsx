import { Input } from '@chakra-ui/react';
import { memo } from 'react';

interface InputMessageProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  disabled: boolean;
  maxLength: number;
}

const InputMessage = memo(function InputMessage({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  maxLength,
}: InputMessageProps) {
  return (
    <Input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      size={{ base: 'sm', md: 'md' }}
      fontSize={{ base: 'sm', md: 'md' }}
    />
  );
});

export default InputMessage;
