"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { SignUpSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth.action";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
    const { isLoggedIn, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (isLoggedIn) {
            const callbackUrl = searchParams.get("callbackUrl");
            router.replace(callbackUrl || "/dashboard");
        }
    }, [isLoggedIn, router, searchParams]);

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        // push to DB the credentials
        try {
            await register(values.username, values.password)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.error(error);
            // suppose to display error message here
        }
    }

    return (
        <Card className="w-[400px] h-fit">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                    Provide login credentials to sign you in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full flex-col gap-5">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col">
                                    <FormLabel className="paragraph-semibold">
                                        Username
                                    </FormLabel>
                                    <FormControl className="mt-1">
                                        <Input
                                            className="no-focus border"
                                            placeholder="Enter your username here"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col">
                                    <FormLabel className="paragraph-semibold">
                                        Password
                                    </FormLabel>
                                    <FormControl className="mt-1">
                                        <Input
                                            className="no-fcous border"
                                            placeholder="Enter your password here"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col">
                                    <FormLabel className="paragraph-semibold">
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl className="mt-1">
                                        <Input
                                            className="no-focus border"
                                            placeholder="Confirm your password here"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="text-sm flex gap-2">
                <p className="text-slate-400">Already had an account?</p>
                <Link
                    href={"/sign-in"}
                    className="underline text-dark hover:text-slate-700">
                    Sign In
                </Link>
            </CardFooter>
        </Card>
    );
};

export default SignUp;
