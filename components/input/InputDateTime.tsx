import React from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DateTimeInputProps {
    control: any;
    name: "start" | "end";
    form: any;
    className?: string;
}

const validateDate = (start: string, end: string): boolean => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (startDate < now) {
        return false;
    }
    if (end && endDate <= startDate) {
        return false;
    }
    return true;
};

const InputDateTime = ({
    control,
    name,
    form,
    className = "border-none focus:border-b-2 focus:border-slate-400",
}: DateTimeInputProps) => {
    return (
        <FormField
            control={control}
            name={name}
            rules={{
                validate: (value) =>
                    name === "start"
                        ? validateDate(value, form.getValues("end"))
                        : validateDate(form.getValues("start"), value),
            }}
            render={({ field, fieldState }) => (
                <FormItem>
                    <FormControl>
                        <Input
                            type="datetime-local"
                            className={className}
                            min={
                                name === "end" && form.watch("start")
                                    ? form.watch("start")
                                    : new Date().toISOString().slice(0, 16)
                            }
                            {...field}
                        />
                    </FormControl>
                    {fieldState.error && (
                        <FormMessage className="text-red-500">
                            {fieldState.error.message || `Invalid ${name} date`}
                        </FormMessage>
                    )}
                </FormItem>
            )}
        />
    );
};

export default InputDateTime;
