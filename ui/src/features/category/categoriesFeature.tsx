import { AlertDialogComponent } from "@/components/building-blocks/alertDialogComponent";
import { AddCategoryForm } from "@/components/building-blocks/forms/addCategoryForm";
import { CategorySection } from "@/components/building-blocks/sections/categorySection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useSaveCategoryMutation,
  useUpdateCategoryMutation,
} from "@/services/categoriesApi";
import { useGetAllProfilesForUserQuery } from "@/services/profilesApi";
import { selectProfileSlice } from "@/slices/profileSlice";
import type { Category } from "@/types/Category";
import { defaultCategory } from "@/utilities/constants";
import { categoryFormSchema } from "@/utilities/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type * as z from "zod";

export default function CategoriesFeature() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] =
    useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<
    Category | undefined
  >();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState<boolean>(false);
  const [categorySearchText, setACategorySearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState('');

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onSubmit",
    defaultValues: defaultCategory,
  });

  const [saveCategory, { isLoading: saveCategoryLoading }] =
    useSaveCategoryMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleteCategoryLoading }] =
    useDeleteCategoryMutation();
  const {
    error: categoriesError,
    isLoading: getAllCategoriesLoading,
    data: categoriesData,
  } = useGetAllCategoriesQuery();
  const {
    error: profilesError,
    isLoading: getAllProfilesLoading,
    data: profilesData,
  } = useGetAllProfilesForUserQuery();
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice);
  const {
    isError: isCategoriesError,
    errorComponent: categoriesErrorComponent,
  } = useApiError(categoriesError);
  const { isError: isProfilesError, errorComponent: profilesErrorComponent } =
    useApiError(profilesError);

  if (
    saveCategoryLoading ||
    getAllCategoriesLoading ||
    updateCategoryLoading ||
    deleteCategoryLoading ||
    getAllProfilesLoading
  ) {
    return <Spinner className="spinner" />;
  }

  if (isCategoriesError) {
    return categoriesErrorComponent;
  }
  if (isProfilesError) {
    return profilesErrorComponent;
  }

  async function onSubmit(formData: z.infer<typeof categoryFormSchema>) {
    if (isUpdate) {
      await updateExistingCategory(formData);
    } else if (!isUpdate) {
      await saveNewCategory(formData);
    } else {
      toast.error("Unknown action, try again");
    }
  }

  async function saveNewCategory(formData: z.infer<typeof categoryFormSchema>) {
    try {
      const profile = profilesData?.find(
        (profile) => profile.profileName === formData.profileName,
      );
      if (!profile) {
        toast.error("Invalid data found, refresh and try again");
        return;
      }

      const result = await saveCategory({
        ...formData,
        profileId: profile.id,
      }).unwrap();

      toast("Category saved!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Category name:
              {result.categoryName}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
          background: "var(--background, #fff)",
          color: "var(--foreground, #000)",
        } as React.CSSProperties,
      });

      setCategoryDialogOpen(false);
    } catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Category already exists with name: ${formData.categoryName}`,
        );
      } else if (error.originalStatus === 400) {
        toast.error("Invalid input. Please check your details.");
      } else if (error.originalStatus === 404) {
        toast.error("This resource does not exist, kindly refresh your page.");
      } else if (error.originalStatus === 403) {
        toast.error(
          "Access denied. You do not have permission to access this resource.",
        );
      } else {
        toast.error("Failed to create category, please try again");
      }
    }
  }

  async function updateExistingCategory(
    formData: z.infer<typeof categoryFormSchema>,
  ) {
    try {
      const profile = profilesData?.find(
        (profile) => profile.profileName === formData.profileName,
      );
      if (!profile) {
        toast.error("Invalid data found, refresh and try again");
        return;
      }
      const result = await updateCategory({
        ...formData,
        profileId: profile.id,
      }).unwrap();

      if (!result) {
        toast.error("Failed to update category, please try again later");
        return;
      }

      toast("Category updated!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Category name:
              {result.categoryName}
            </code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
          background: "var(--background, #fff)",
          color: "var(--foreground, #000)",
        } as React.CSSProperties,
      });

      setIsUpdate(false);
      setCategoryDialogOpen(false);
    } catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Category already exists with name: ${formData.categoryName}`,
        );
      } else if (error.originalStatus === 400) {
        toast.error("Invalid input. Please check your details.");
      } else if (error.originalStatus === 403) {
        toast.error(
          "Access denied. You do not have permission to access this resource.",
        );
      } else if (error.originalStatus === 404) {
        toast.error("This resource does not exist, kindly refresh your page.");
      } else {
        toast.error("Failed to update category, please try again");
      }
    }
  }

  const handleDeleteCategory = (category: Category) => {
    setDeleteCategoryDialogOpen(true);
    setCurrentCategory(category);
  };

  const cancelDeleteCategory = () => {
    setDeleteCategoryDialogOpen(false);
  };

  const deleteCurrentCategory = async () => {
    if (currentCategory && currentCategory.id) {
      await deleteCategory(currentCategory.id);
      toast.info(
        `Category : ${currentCategory.categoryName} deleted successfully!`,
      );
      setDeleteCategoryDialogOpen(false);
    } else {
      toast.error("Invalid category! Please refresh the page");
    }
  };

  const filteredCategoriesData = categoriesData?.filter((category) => {
    return (
      enabledMap[category.profileId] &&
      (!categorySearchText ||
        category.categoryName
          .toLowerCase()
          .includes(categorySearchText.toLowerCase()))
      && (selectedTag ? category.tags?.includes(selectedTag) : true)
    );
  });

  const tags = filteredCategoriesData?.flatMap(category => category.tags);
  const uniqueTags = [...new Set(tags)];

  if (filteredCategoriesData && profilesData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex gap-2 min-w-lg">
            <Input
              type="search"
              placeholder="Search categories by name..."
              className="search-bar"
              onChange={(e) => setACategorySearchText(e.target.value)}
            />
            {tags ? (
              <>
                <Select value={selectedTag} onValueChange={e => setSelectedTag(e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tags</SelectLabel>
                      {uniqueTags.map(tag => {
                        if (tag) {
                          return (<SelectItem key={tag} value={tag}>{tag}</SelectItem>);
                        }
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button variant="destructive" onClick={() => setSelectedTag('')}>Clear tags</Button>
              </>
            ) : <></>}
          </div>
          <AddCategoryForm
            form={form}
            categoryDialogOpen={categoryDialogOpen}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setCategoryDialogOpen={setCategoryDialogOpen}
            onSubmit={onSubmit}
            profiles={profilesData}
          />
        </div>

        <div className="normal-grid">
          {filteredCategoriesData.sort((categoryA, categoryB) => categoryA.categoryName.localeCompare(categoryB.categoryName)).map((category) => {
            const profile = profilesData.find(
              (profile) => profile.id === category.profileId,
            );
            if (profile) {
              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  handleDeleteCategory={handleDeleteCategory}
                  profile={profile}
                  form={form}
                  setCategoryDialogOpen={setCategoryDialogOpen}
                  setIsUpdate={setIsUpdate}
                />
              );
            } else {
              return (
                <p
                  key={category.id}
                  role="alert"
                  className="text-red-600 font-medium"
                >
                  Profile not found for this category, contact admin.
                </p>
              );
            }
          })}
        </div>
        <AlertDialogComponent
          isDialogOpen={deleteCategoryDialogOpen}
          alertType="DELETE_CATEGORY"
          onSecondaryButtonClick={cancelDeleteCategory}
          onPrimaryButtonClick={deleteCurrentCategory}
        />
      </div>
    );
  }
}
