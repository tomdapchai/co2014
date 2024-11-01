// LogoUpload.tsx
import { useController, Control } from "react-hook-form";
import { useRef, useState } from "react";
import Image from "next/image";
import { FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
    control: Control<any>;
    name: string;
    defaultImage?: string;
    className?: string;
}

const LogoUpload = ({
    control,
    name,
    defaultImage = "/assets/eventLogo.png",
    className = "",
}: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string>(defaultImage);
    const [isUploading, setIsUploading] = useState(false);

    const { field } = useController({
        name,
        control,
        defaultValue: "",
    });

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate file type
            const validType = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "image/webp",
            ];
            if (!validType.includes(file.type)) {
                alert(
                    "Invalid file type. Only .png, .jpg, .jpeg, .webp are allowed"
                );
                return;
            }

            if (file.size > 1048576) {
                alert("File size must be less than 1MB");
                return;
            }

            setIsUploading(true);

            try {
                // https://cloudinary.com/documentation/image_upload_api_reference
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "yxg1dfzu");

                await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        // For better security, use secure_url for https
                        field.onChange(data.secure_url);
                        setImageSrc(data.secure_url);
                    })
                    .catch((error) => {
                        console.error("Upload error:", error);
                        alert("Failed to upload image. Please try again.");
                    });
            } catch (error) {
                console.error("Upload error:", error);
                alert("Failed to upload image. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <FormItem className={className}>
            <div className="relative">
                <Image
                    src={imageSrc}
                    alt="Upload image"
                    width={300}
                    height={300}
                    onClick={handleImageClick}
                    className={`hover:cursor-pointer hover:brightness-95 rounded-xl object-contain ${
                        isUploading ? "opacity-50" : ""
                    }`}
                />
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                )}
            </div>
            <FormMessage />
            <FormControl>
                <Input
                    id={name}
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    name={field.name}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                />
            </FormControl>
        </FormItem>
    );
};

export default LogoUpload;
