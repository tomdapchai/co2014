import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

// Define the type for individual select options
interface SelectOption {
    value: string;
    label: string;
    description?: string;
}

interface CustomFormSelectProps {
    name: string;
    control: any;
    options: SelectOption[];
    defaultValue?: string;
    className?: string;
    triggerClassName?: string;
    onChange?: (value: any) => void;
}

const SelectForm = ({
    name,
    control,
    options,
    defaultValue,
    className = "",
    triggerClassName = "w-fit border border-black rounded-lg bg-slate-50",
    onChange,
}: CustomFormSelectProps) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <Select
                        onValueChange={(value) => {
                            field.onChange;
                            console.log(value);
                            if (onChange) onChange(value);
                        }}
                        defaultValue={defaultValue || field.value}>
                        <FormControl>
                            <SelectTrigger className={triggerClassName}>
                                <SelectValue>
                                    {typeof field.value === "string"
                                        ? field.value.charAt(0).toUpperCase() +
                                          field.value.slice(1)
                                        : "limited".charAt(0).toUpperCase() +
                                          "limited".slice(1)}
                                </SelectValue>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="flex flex-col justify-center items-start">
                                    <p className="font-bold text-base">
                                        {option.label}
                                    </p>
                                    {option.description && (
                                        <p className="text-gray-400">
                                            {option.description}
                                        </p>
                                    )}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
};

export default SelectForm;
