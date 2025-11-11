export interface ProfileState {
  loading: boolean;
  update: (
    id: string,
    updatedProfile: {
      fullName?: string;
      phoneNumber?: string;
      bio?: string;
      avatarUrl?: string;
      avatarPublicId?: string;
    }
  ) => Promise<void>;
}
