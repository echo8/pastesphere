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
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { User } from "../types";
import { SnippetType } from "../../../server/src/types";

interface SnippetFormProps {
  user: User;
}

interface SnippetValues {
  title: string;
  description: string;
  type: SnippetType;
  body: string;
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => !Number.isNaN(k)) as K[];
}

export function SnippetForm({ user }: SnippetFormProps) {
  const navigate = useNavigate();
  const { mutate: logout, isPending: isLogoutPending } =
    trpc.logout.useMutation({
      onSuccess() {
        navigate(0);
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SnippetValues>();

  const snippetTypes = createListCollection({
    items: enumKeys(SnippetType).map((key) => {
      const snippetType = SnippetType[key];
      return { label: snippetType.toString(), value: snippetType };
    }),
  });

  const { mutate: create, isPending: isCreatePending } =
    trpc.snippet.create.useMutation({
      onSuccess(data) {
        navigate(`/user/${data.authorHandle}/snippet/${data.rkey}`);
      },
    });
  const onSubmit = handleSubmit((data) => create(data));

  return (
    <Container maxW="4xl">
      <form onSubmit={onSubmit}>
        <HStack marginBottom="0.3rem">
          <Icon
            fontSize="3xl"
            color="gray.500"
            padding="0.1rem"
            margin="0.1rem"
          >
            <PiUserSquare />
          </Icon>
          <Text width="50%" textAlign="left">
            {user.handle}
          </Text>
          <Box width="50%" textAlign="right">
            <Button
              size="xs"
              variant="outline"
              loading={isLogoutPending}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          </Box>
        </HStack>
        <Box
          borderWidth="3px"
          borderRadius="md"
          padding="0.2rem"
          borderColor="gray.800"
        >
          <VStack>
            <HStack
              width="100%"
              paddingBottom="0.5rem"
              borderBottomColor="teal.600"
              borderBottomWidth="5px"
            >
              <Input
                background="gray.800"
                placeholder="Title"
                {...register("title", { required: "Title is required" })}
              />
              <Input
                background="gray.800"
                placeholder="Description"
                {...register("description")}
              />
              <SelectRoot
                background="gray.800"
                collection={snippetTypes}
                {...register("type", { required: "Type is required" })}
              >
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
              background="gray.800"
              placeholder="Your snippet"
              rows={10}
              fontFamily="monospace"
              {...register("body", { required: "Body is required" })}
            />
          </VStack>
        </Box>
        <Center margin="1.0rem">
          <Button background="gray.800" color="whiteAlpha.800" loading={isCreatePending} type="submit">
            Submit
          </Button>
        </Center>
      </form>
    </Container>
  );
}
