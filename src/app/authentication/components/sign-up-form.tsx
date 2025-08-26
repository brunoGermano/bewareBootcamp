// converts component que usa hook para um client component, use line down. So this component will be a use client component and not a server component anymore.
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

//Creates a schema for a form object. Using Object validation using zod library
const formSchema = z
  .object({
    name: z.string("Nome inválido.").trim().min(1, "Nome é obrigatório."),
    email: z.email("Email inválido."),
    password: z.string("Senha inválida.").min(8, "Senha inválida."),
    passwordConfirmation: z.string("Senha inválida.").min(8, "Senha inválida."),
  })
  .refine(
    // Refine method creates a conditional validation for fieds that depends from other one in the same form, for example, in this case, check if "password" e "passwordConfirmation" are equal.
    (data) => {
      // returning "true", means it is all right with the confirmation
      return data.password === data.passwordConfirmation;
    },
    {
      error: "As senhas não coincidem.",
      // Put the error message above on the following field
      path: ["passwordConfirmation"],
    },
  );

type Formvalues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // 2. Define a submit handler. It is always Executed when the form were validated
  async function onSubmit(values: Formvalues) {
    await authClient.signUp.email({
      name: values.name, // required
      email: values.email, // required
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          // toast.success("Conta criada com sucesso!");
          router.push("/");
        },
        onError: (error) => {
          if (
            error.error.code === authClient.$ERROR_CODES.USER_ALREADY_EXISTS
          ) {
            toast.success("E-mail já cadastrado.");
            return form.setError("email", {
              message: "E-mail já cadastrado.",
            });
          }
          toast.success(error.error.message);
        },
      },
    });
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Crie uma conta para continuar.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="grid w-full gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a sua senha"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a sua senha novamente"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button>Criar conta</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default SignUpForm;
