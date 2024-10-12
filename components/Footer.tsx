import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <div className="flex bg-slate-500 bg-opacity-10 items-center justify-center w-full ">
            <div className="flex justify-between items-center max-md:flex-col w-[70%] px-5 py-5 ">
                <div className="flex justify-between items-center md:gap-2 max-md:flex-col">
                    <h3 className="font-bold">LAMBO</h3>
                    <div className="flex w-fit justify-between items-center max-md:flex-col">
                        <Button variant="link" className="">
                            <Link href="/">Privacy</Link>
                        </Button>
                        <Button variant="link" className="">
                            <Link href="/">Terms & Policy</Link>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-row justify-between w-fit gap-2">
                    <Image
                        src={"/assets/facebook.png"}
                        alt="facebook logo"
                        width={20}
                        height={20}
                    />
                    <Image
                        src={"/assets/instagram.png"}
                        alt="instagram logo"
                        width={20}
                        height={20}
                    />
                    <Image
                        src={"/assets/twitter.png"}
                        alt="twitter logo"
                        width={20}
                        height={20}
                    />
                </div>
            </div>
        </div>
    );
};

export default Footer;
