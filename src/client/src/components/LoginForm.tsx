import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Center,
  Text,
  Container,
  Input,
  Link,
} from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { LuUser } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";

interface LoginValues {
  handle: string;
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const { mutate, isPending } = trpc.login.useMutation({
    onSuccess(data) {
      window.location.href = data.redirectUrl;
    },
  });
  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <form onSubmit={onSubmit}>
      <Container maxW="lg" marginBottom="3rem">
        <Box borderWidth="1px" borderRadius="sm" padding="0.2rem">
          <VStack gap="0.3rem">
            <Box
              width="100%"
              borderBottomColor="teal.600"
              borderBottomWidth="5px"
            >
              <Box width="100%" background="gray.900" marginBottom="0.3rem">
                <Heading textAlign="center">Login to get started!</Heading>
              </Box>
            </Box>
            <HStack width="100%">
              <InputGroup flex="1" startElement={<LuUser />}>
                <Input
                  variant="subtle"
                  placeholder="Handle"
                  {...register("handle", { required: "Handle is required" })}
                />
              </InputGroup>
              <Button variant="subtle" loading={isPending} type="submit">
                Login
              </Button>
            </HStack>
          </VStack>
        </Box>
        <Center paddingTop="1rem">
          <Text color="fg.muted" textStyle="sm">
            Don't have an account?{" "}
            <Link
              href="https://bsky.app/"
              variant="underline"
              colorPalette="teal"
            >
              Sign up on Bluesky
            </Link>
            , then return here to login.
          </Text>
        </Center>
      </Container>
    </form>
  );
}
