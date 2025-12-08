import { ProfilePicture } from "@/components/building-blocks/profilePicture";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CategorySectionProps } from "@/types/CategorySectionProps";
import { DynamicIcon } from "lucide-react/dynamic";

export function CategorySection({
  category,
  handleUpdateCategory,
  handleDeleteCategory,
}: CategorySectionProps) {
  return (
    <Card
      key={category.id}
      className="hover:shadow-md transition flex justify-between"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 break-all">
          <DynamicIcon
            name={category.icon ? category.icon : ("badge-check" as any)}
            color={category.colorCode}
          />
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.colorCode }}
          />
          {category.categoryName}
        </CardTitle>
        <ProfilePicture imageSource="" fallbackName="" imageColor="" />
      </CardHeader>
      <CardContent className="mb-2">
        <p className="text-sm text-muted-foreground mb-4 break-all">
          {category.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {category.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              style={{ color: category.colorCode }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-row gap-2 justify-between">
        <Button variant="ghost" onClick={() => handleUpdateCategory(category)}>
          <DynamicIcon
            name="edit"
            color={category.colorCode}
            className="h-4 w-4"
          />
          Edit
        </Button>
        <Button variant="ghost" onClick={() => handleDeleteCategory(category)}>
          <DynamicIcon
            name="trash"
            color={category.colorCode}
            className="h-4 w-4"
          />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
