export interface Profile {
  id: number
  profileName: string
  colorCode: string
  description?: string
  profilePicture?: string
  profilePictureFile?: File
  categoryIds: Array<number>
  expenseIds: Array<number>
}
