import {
  Box,
  HStack,
  VStack,
  Text,
  Container,
  Textarea,
  Input,
  createListCollection,
  Icon,
  Center,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PiUserSquare } from "react-icons/pi";
import { trpc } from "@/utils/trpc";
import { User } from "../types";

interface SnippetFormProps {
  user: User;
}

export function SnippetForm({ user }: SnippetFormProps) {
  const { mutate, isPending } = trpc.logout.useMutation({
    onSuccess() {
      window.location.href = "/";
    },
  });

  const snippetTypes = createListCollection({
    items: [
      { label: "Plain Text", value: "text" },
      { label: "Markdown", value: "markdown" },
      { label: "Java", value: "java" },
    ],
  });

  return (
    <Container maxW="4xl">
      <HStack marginBottom="0.3rem">
        <Icon fontSize="3xl" color="gray.500" padding="0.1rem" margin="0.1rem">
          <PiUserSquare />
        </Icon>
        <Text width="50%" textAlign="left">
          {user.name}
        </Text>
        <Box width="50%" textAlign="right">
          <Button
            size="xs"
            variant="outline"
            loading={isPending}
            onClick={() => {
              mutate();
            }}
          >
            Logout
          </Button>
        </Box>
      </HStack>
      <Box borderWidth="1px" borderRadius="sm" padding="0.2rem">
        <VStack>
          <HStack
            width="100%"
            paddingBottom="0.5rem"
            borderBottomColor="teal.600"
            borderBottomWidth="5px"
          >
            <Input variant="subtle" placeholder="Title" />
            <Input variant="subtle" placeholder="Description" />
            <SelectRoot variant="subtle" collection={snippetTypes}>
              <SelectTrigger>
                <SelectValueText placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {snippetTypes.items.map((type) => (
                  <SelectItem item={type} key={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </HStack>
          <Textarea
            variant="subtle"
            placeholder="Your snippet"
            rows={10}
            fontFamily="monospace"
          />
        </VStack>
      </Box>
      <Center margin="1.0rem">
        <Button variant="subtle">Submit</Button>
      </Center>
    </Container>
  );
}
