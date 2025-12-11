export const defaultProfile = {
  profileName: "",
  profileColorCode: "#000000",
  profileDescription: "",
  profilePicture: undefined,
};

export const defaultCategory = {
  categoryName: "",
  categoryDescription: "",
  categoryColorCode: "#000000",
  categoryIcon: "",
  categoryTags: [],
};

export const defaultLogin = {
  username: "",
  password: "",
};

export const defaultSignUp = {
  username: "",
  password: "",
  confirmPassword: "",
};

export const defaultAccount = {
  accountName: "",
  accountBalance: 0,
  accountDescription: "",
  accountType: "",
  profileName: "",
};

export const defaultExpense = {
  expenseAmount: 0,
  expenseDescription: "",
  expenseCreatedAt: "",
  expenseUpdatedAt: "",
  categoryName: "",
  accountName: "",
  profileName: "",
};

export const ALL_TAG_TYPES = [
  "Accounts",
  "Expenses",
  "Categories",
  "Auth",
  "Profiles",
] as const;
