import { AccountSection } from "@/components/building-blocks/sections/accountSection";
import { AlertDialogComponent } from "@/components/building-blocks/alertDialogComponent";
import { AddAccountForm } from "@/components/building-blocks/forms/addAccountForm";
import { Spinner } from "@/components/ui/spinner";
import { useApiError } from "@/hooks/use-api-error";
import {
  useDeleteAccountMutation,
  useGetAllAccountsQuery,
  useSaveAccountMutation,
  useUpdateAccountMutation,
} from "@/services/accountsApi";
import { useGetAllProfilesForUserQuery } from "@/services/profilesApi";
import { selectProfileSlice } from "@/slices/profileSlice";
import type { Account } from "@/types/Account";
import { defaultAccount } from "@/utilities/constants";
import { accountFormSchema } from "@/utilities/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type * as z from "zod";
import { Input } from "@/components/ui/input";

export function AccountsFeature() {
  const [isUpdate, setIsUpdate] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState<boolean>(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] =
    useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<Account | undefined>();
  const [accountSearchText, setAccountSearchText] = useState('');

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    mode: "onSubmit",
    defaultValues: defaultAccount,
  });

  const {
    error: accountsError,
    isLoading: getAllAccountsLoading,
    data: accountsData,
  } = useGetAllAccountsQuery();
  const {
    error: profilesError,
    isLoading: getAllProfilesLoading,
    data: profilesData,
  } = useGetAllProfilesForUserQuery();
  const [saveAccount, { isLoading: saveAccountLoading }] =
    useSaveAccountMutation();
  const [updateAccount, { isLoading: updateAccountLoading }] =
    useUpdateAccountMutation();
  const [deleteAccount, { isLoading: deleteAccountLoading }] =
    useDeleteAccountMutation();
  const enabledMap: Record<number, boolean> = useSelector(selectProfileSlice);
  const { isError: isAccountsError, errorComponent: accountsErrorComponent } =
    useApiError(accountsError);
  const { isError: isProfilesError, errorComponent: profilesErrorComponent } =
    useApiError(profilesError);

  if (
    getAllAccountsLoading ||
    saveAccountLoading ||
    updateAccountLoading ||
    deleteAccountLoading ||
    getAllProfilesLoading
  ) {
    return <Spinner className="spinner" />;
  }

  if (isAccountsError) {
    return accountsErrorComponent;
  }
  if (isProfilesError) {
    return profilesErrorComponent;
  }

  async function onSubmit(formData: z.infer<typeof accountFormSchema>) {
    if (isUpdate) {
      await updateExistingAccount(formData);
    } else if (!isUpdate) {
      await saveNewAccount(formData);
    } else {
      toast.error("Unknown action, try again");
    }
  }

  async function saveNewAccount(formData: z.infer<typeof accountFormSchema>) {
    try {
      const profile = profilesData?.find(
        (profile) => profile.profileName === formData.profileName,
      );
      if (!profile) {
        toast.error("Invalid data found, refresh and try again");
        return;
      }
      const result = await saveAccount({
        ...formData,
        profileId: profile.id,
      }).unwrap();

      toast("Account saved!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>
              Account name:
              {result.accountName}
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

      setAccountDialogOpen(false);
    } catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Account already exists with name: ${formData.accountName}`,
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
        toast.error("Failed to create account, please try again");
      }
    }
  }

  async function updateExistingAccount(
    formData: z.infer<typeof accountFormSchema>,
  ) {
    try {
      const updatedFormData = {
        ...formData,
        accountPicture: undefined,
      };
      const profile = profilesData?.find(
        (profile) => profile.profileName === updatedFormData.profileName,
      );
      if (!profile) {
        toast.error("Invalid data found, refresh and try again");
        return;
      }
      const result = await updateAccount({
        ...updatedFormData,
        profileId: profile.id,
      }).unwrap();

      if (!result) {
        toast.error("Failed to update account, please try again later");
        return;
      }

      toast("Account updated!", {
        description: (
          <pre
            className="mt-2 w-[320px] overflow-x-auto rounded-md p-4"
            style={{
              background: "var(--background-code, #1a1a1a)",
              color: "var(--foreground-code, #f5f5f5)",
            }}
          >
            <code>Account name: {result.accountName}</code>
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
      setAccountDialogOpen(false);
    } catch (error: any) {
      if (error?.originalStatus === 409) {
        toast.error(
          `Account already exists with name: ${formData.accountName}`,
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
        toast.error("Failed to update account, please try again");
      }
    }
  }

  const cancelDeleteAccount = () => {
    setDeleteAccountDialogOpen(false);
  };

  const deleteCurrentAccount = async () => {
    if (currentAccount && currentAccount.id) {
      await deleteAccount(currentAccount.id);
      toast.info(
        `Account : ${currentAccount.accountName} deleted successfully!`,
      );
      setDeleteAccountDialogOpen(false);
    } else {
      toast.error("Invalid account! Please refresh the page");
    }
  };

  const handleDeleteAccount = (account: Account) => {
    setDeleteAccountDialogOpen(true);
    setCurrentAccount(account);
  };

  const filteredAccountsData = accountsData?.filter(
    (account) => {
      return enabledMap[account.profileId] && (!accountSearchText || account.accountName.toLowerCase().includes(accountSearchText.toLowerCase()));
    }
  );

  if (profilesData) {
    return (
      <div id="accountsSection">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Accounts</h1>
          <Input type="search" placeholder="Search accounts..." className="search-bar" onChange={e => setAccountSearchText(e.target.value)} />
          <AddAccountForm
            profiles={profilesData}
            form={form}
            onSubmit={onSubmit}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            accountDialogOpen={accountDialogOpen}
            setAccountDialogOpen={setAccountDialogOpen}
          />
        </div>
        <div className="normal-grid">
          {filteredAccountsData ? (
            filteredAccountsData.map((account) => {
              const profile = profilesData.find(
                (profile) => profile.id === account.profileId,
              );
              if (profile) {
                return (
                  <AccountSection
                    account={account}
                    profile={profile}
                    key={account.id}
                    form={form}
                    setIsUpdate={setIsUpdate}
                    setAccountDialogOpen={setAccountDialogOpen}
                    handleDeleteAccount={handleDeleteAccount}
                  />
                );
              } else {
                return (
                  <p
                    key={account.id}
                    role="alert"
                    className="text-red-600 font-medium"
                  >
                    Profile not found for this account, contact admin.
                  </p>
                );
              }
            })
          ) : (
            <p className="text-muted-foreground text-sm">
              Create a new account here
            </p>
          )}
        </div>
        <AlertDialogComponent
          isDialogOpen={deleteAccountDialogOpen}
          alertType="DELETE_ACCOUNT"
          onSecondaryButtonClick={cancelDeleteAccount}
          onPrimaryButtonClick={deleteCurrentAccount}
        />
      </div>
    );
  }
}
