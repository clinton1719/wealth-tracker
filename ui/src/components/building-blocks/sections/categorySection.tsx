import { ProfilePicture } from "@/components/building-blocks/profilePicture";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/Category";
import type { CategorySectionProps } from "@/types/CategorySectionProps";
import { DynamicIcon } from "lucide-react/dynamic";

export function CategorySection({
  category,
  handleDeleteCategory,
  profile,
  form,
  setCategoryDialogOpen,
  setIsUpdate
}: CategorySectionProps) {
  const handleUpdateCategory = (category: Category) => {
    form.reset(category);
    form.setValue("profileName", profile.profileName);
    setCategoryDialogOpen(true);
    setIsUpdate(true);
  };

  return (
    <Card
      className="card"
      style={{ backgroundColor: `${profile.colorCode}40` }}
    >
      <CardHeader>
        <CardTitle>
          <ProfilePicture
            imageSource={profile.profilePicture}
            fallbackName={profile.profileName.charAt(0)}
            imageColor={profile.colorCode}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-row gap-2">
              <DynamicIcon
                name={category.categoryIcon ? category.categoryIcon : ("badge-check" as any)}
                color={category.categoryColorCode}
              />
              <span className="card-title" style={{color: category.categoryColorCode}}>{category.categoryName}</span>
            </div>
          </div>
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted rounded-full shrink-0"
              >
                <DynamicIcon name="ellipsis-vertical" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                onClick={() => handleUpdateCategory(category)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteCategory(category)}
                className="cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="card-key">Description: </span>
            <span className="text-value">{category.categoryDescription}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex flex-wrap gap-2 mt-4">
          {category.categoryTags?.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              style={{ color: category.categoryColorCode }}
            >
              {tag}
            </Badge>
          ))}
        </div> </CardFooter>
    </Card>
  );
}
