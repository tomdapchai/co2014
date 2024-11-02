import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const page = () => {
    const { isLoggedIn } = useAuth();
    return (
        <div className="flex flex-col justify-between items-center w-full h-full">
            <header className="flex justify-between py-5 px-5 w-full">
                <Link href="/">
                    <h1 className="text-3xl font-bold">LAMBO</h1>
                </Link>
                {!isLoggedIn && (
                    <div className="flex gap-5">
                        <Button
                            className="background-light text-dark hover:bg-white/80"
                            asChild>
                            <Link href={"/sign-up"}>Sign up</Link>
                        </Button>
                        <Button
                            className="background-dark text-light hover:bg-black/80"
                            asChild>
                            <Link href={"/sign-in"}>Sign In</Link>
                        </Button>
                    </div>
                )}
            </header>
            <div className="flex flex-row justify-between gap-32 max-md:flex-col max-md:gap-0 max-md:items-center">
                <div className="w-[300px] py-10 max-md:flex max-md:flex-col max-md:justify-center max-md:items-center max-md:pt-0 ">
                    <h1 className="text-6xl font-bold max-md:text-4xl max-md:text-center">
                        <span className="text-dark">
                            Delightful <br className="max-md:hidden" /> events
                        </span>{" "}
                        <br />
                        <span className="text-light">Start here</span>
                    </h1>
                    <p className="text-dark mt-10 text-xl max-md:text-center max-md:mt-5">
                        Set up an event page, invite friends and sell tickets.
                        Host a memorable event today.
                    </p>
                    <Button
                        className="background-dark mt-8 py-5 font-bold"
                        asChild>
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/sign-in"}
                            className="text-light text-base">
                            Create your first event
                        </Link>
                    </Button>
                </div>
                <div className="background-brown rounded-xl w-[800px] max-xl:w-[400px] max-md:w-[300px] max-md:h-[200px]"></div>
            </div>
            <footer className="w-full flex px-20 justify-between"></footer>
        </div>
    );
};

export default page;
