import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { trpc } from "@/utils/trpc";
import { Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

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
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field
          label="Handle"
          invalid={!!errors.handle}
          errorText={errors.handle?.message}
        >
          <Input {...register("handle", { required: "Handle is required" })} />
        </Field>
        <Button type="submit" loading={isPending}>
          Login
        </Button>
      </Stack>
    </form>
  );
}
