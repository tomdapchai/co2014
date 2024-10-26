import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

interface Props {
    title: string;
    description: string;
    link: string;
    linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
    return (
        <div className="mt-10 flex w-full flex-col items-center justify-center">
            <Image
                src="/assets/no_result.png"
                alt="no result illustration"
                width={270}
                height={200}
                className="block object-contain"
            />

            <h2 className="h2-bold mt-8">{title}</h2>
            <p className="body-regular my-3.5 max-w-md text-center">
                {description}
            </p>
            <Link href={link}>
                <Button className="background-light text-slate-900 hover:bg-slate-300 hover:bg-opacity-50 mt-5 min-h-[46px] rounded-lg px-4 py-3">
                    {linkTitle}
                </Button>
            </Link>
        </div>
    );
};

export default NoResult;
