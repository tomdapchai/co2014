import React, { useState, useRef } from "react";
import { Input, InputProps } from "./ui/input";
import { Button } from "./ui/button";

const InputNumber = ({ ...props }: InputProps) => {
    const [value, setValue] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <Button
                variant="ghost"
                onClick={() => setValue((prev) => prev + 1)}>
                +
            </Button>
            <Input
                {...props}
                type="number"
                value={value}
                className="no-spinners"
            />
            <Button
                variant="ghost"
                onClick={() => setValue((prev) => prev - 1)}>
                -
            </Button>
        </div>
    );
};

export default InputNumber;
