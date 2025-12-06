export interface Profile {
  id: number;
  profileName: string;
  colorCode: string;
  description?: string;
  profilePicture?: string;
  profilePictureFile?: File;
  ProfileIds: Array<number>;
  categoryIds: Array<number>;
  expenseIds: Array<number>;
}
