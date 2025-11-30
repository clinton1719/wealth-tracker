export interface Profile {
  id: number
  profileName: string
  colorCode: string
  description: string
  profilePicture: File | undefined
  ProfileIds: Array<number>
  categoryIds: Array<number>
  expenseIds: Array<number>
}
