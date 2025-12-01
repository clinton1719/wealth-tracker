import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ProfilePictureProps } from "@/types/ProfilePictureProps";

export function ProfilePicture({ fallbackName, imageSource, imageColor }: ProfilePictureProps) {
    return (
        <Avatar className="h-10 w-10">
            <AvatarImage src={imageSource} alt="@shadcn" className="rounded-full h-full w-full object-cover" />
            <AvatarFallback
                style={{ color: imageColor }}
                className="rounded-full h-full w-full text-lg"
            >
                {fallbackName}
            </AvatarFallback>
        </Avatar>
    );
}