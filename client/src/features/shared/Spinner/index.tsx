import { Flex, Text } from "@radix-ui/themes";
import "./styles.css";

interface LoaderProps {
  message?: string;
}

const Spinner = ({ message }: LoaderProps) => {
  return (
    <Flex className="spinner" direction="column" gap="2" align="center">
      <span />
      {message && <Text color="gray">{message}</Text>}
    </Flex>
  );
};

Spinner.displayName = "Spinner";
export { Spinner };
