export interface Profile {
  profileId: number
  profileName: string
  profileColorCode: string
  profileDescription?: string
  profilePicture?: string
  profilePictureFile?: File
  categoryIds: Array<number>
  expenseIds: Array<number>
}
