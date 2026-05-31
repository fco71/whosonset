const PASSWORD_PROVIDER_ID = 'password';

type VerificationProfile = {
  emailVerificationRequired?: unknown;
} | null | undefined;

type VerificationUser = {
  emailVerified: boolean;
  providerData: Array<{ providerId: string }>;
} | null | undefined;

export function isPasswordAuthUser(user: VerificationUser): boolean {
  return Boolean(user?.providerData?.some(provider => provider.providerId === PASSWORD_PROVIDER_ID));
}

export function shouldRequireEmailVerification(
  user: VerificationUser,
  profile: VerificationProfile
): boolean {
  return Boolean(
    user &&
    isPasswordAuthUser(user) &&
    !user.emailVerified &&
    profile?.emailVerificationRequired === true
  );
}
