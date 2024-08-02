import {
  Button,
  HStack,
  Input,
  StackProps,
  useNumberInput,
  UseNumberInputProps,
} from "@chakra-ui/react";

export interface NumberInputProps extends UseNumberInputProps {
  styleProps?: StackProps;
}

export default function NumberInput({
  styleProps,
  ...props
}: NumberInputProps) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 0,
      min: 0,
      ...props,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack maxW="320px" {...styleProps}>
      <Button {...dec}>-</Button>
      <Input {...input} />
      <Button {...inc}>+</Button>
    </HStack>
  );
}
