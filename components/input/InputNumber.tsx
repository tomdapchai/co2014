import React from "react";
import { Input, InputProps } from "../ui/input";
import { Button } from "../ui/button";
import { useController, Control } from "react-hook-form";

interface InputNumberProps extends Omit<InputProps, "value" | "onChange"> {
    control: Control<any>;
    name: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    extraClass?: string;
}

const InputNumber = ({
    control,
    name,
    defaultValue,
    min,
    max,
    step = 1,
    placeholder,
    extraClass,
    ...props
}: InputNumberProps) => {
    const {
        field: { value, onChange, onBlur },
    } = useController({
        name,
        control,
    });

    const getInputWidth = () => {
        const valueLength = value
            ? Math.abs(value).toString().length + (value < 0 ? 1 : 0)
            : 0;

        const placeholderLength = placeholder ? placeholder.length : 0;

        const charWidth = Math.max(valueLength, placeholderLength, 3) + 2;

        return {
            minWidth: `${charWidth}ch`,
            width: `${charWidth}ch`,
        };
    };

    const handleIncrement = () => {
        const newValue = (value || 0) + step;
        if (max !== undefined && newValue > max) return;
        onChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = (value || 0) - step;
        if (min !== undefined && newValue < min) return;
        onChange(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (isNaN(newValue)) {
            onChange(undefined);
            return;
        }
        if (min !== undefined && newValue < min) return;
        if (max !== undefined && newValue > max) return;
        onChange(newValue);
    };

    return (
        <div className="flex">
            <Button
                type="button"
                variant="ghost"
                onClick={handleDecrement}
                className="rounded-full">
                -
            </Button>
            <Input
                {...props}
                type="number"
                value={typeof value === "number" ? value : defaultValue}
                onChange={handleChange}
                onBlur={onBlur}
                placeholder={placeholder}
                style={getInputWidth()}
                className={`no-spinners text-center ring-visible:none border-none shadow-none px-2 ${extraClass}`}
                min={min}
                max={max}
                step={step}
            />
            <Button
                type="button"
                variant="ghost"
                onClick={handleIncrement}
                className="rounded-full">
                +
            </Button>
        </div>
    );
};

export default InputNumber;
