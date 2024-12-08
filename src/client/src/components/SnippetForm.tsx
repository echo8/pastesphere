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
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PiUserSquare } from "react-icons/pi";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/utils/trpc";
import { User } from "../types";
import { enumKeys } from "../utils/enum";
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

const snippetSchema = z.object({
  title: z
    .string()
    .min(1, "You must input a title.")
    .max(256, "Your title is too long."),
  description: z.string().max(256, "Your description is too long.").nullable(),
  type: z.nativeEnum(SnippetType, {
    message: "You must select a file type.",
  }),
  body: z
    .string()
    .min(1, "You must input a snippet.")
    .refine((data) => new Blob([data]).size <= 256000, {
      message: "Your snippet is too large.",
    }),
});

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
  } = useForm<SnippetValues>({ resolver: zodResolver(snippetSchema) });

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
          borderColor={{ base: "gray.300", _dark: "gray.800" }}
        >
          <VStack>
            <HStack
              width="100%"
              paddingBottom="0.5rem"
              borderBottomColor="teal.600"
              borderBottomWidth="5px"
            >
              <Input
                background={{ base: "gray.200", _dark: "gray.800" }}
                placeholder="Title"
                {...register("title")}
              />
              <Input
                background={{ base: "gray.200", _dark: "gray.800" }}
                placeholder="Description"
                {...register("description")}
              />
              <SelectRoot
                background={{ base: "gray.200", _dark: "gray.800" }}
                collection={snippetTypes}
                {...register("type")}
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
              background={{ base: "gray.200", _dark: "gray.800" }}
              placeholder="Your snippet"
              rows={10}
              fontFamily="monospace"
              {...register("body")}
            />
          </VStack>
        </Box>
        <Center margin="1.0rem">
          <Button
            background={{ base: "gray.500", _dark: "gray.800" }}
            color="whiteAlpha.800"
            loading={isCreatePending}
            type="submit"
          >
            Submit
          </Button>
        </Center>
        {errors.title?.message ? (
          <Alert
            status="error"
            title={errors.title?.message}
            marginBottom="5px"
          />
        ) : (
          ""
        )}
        {errors.type?.message ? (
          <Alert
            status="error"
            title={errors.type?.message}
            marginBottom="5px"
          />
        ) : (
          ""
        )}
        {errors.body?.message ? (
          <Alert
            status="error"
            title={errors.body?.message}
            marginBottom="5px"
          />
        ) : (
          ""
        )}
      </form>
    </Container>
  );
}
