import { StateCreator } from "zustand";
import { RootStore } from "./RootStore";

// Typescript interface for this store slice
export interface AuthenticationStore {
  authToken?: string;
  authEmail: string;
  setAuthToken: (value?: string) => void;
  setAuthEmail: (value: string) => void;
  logout: () => void;
}

// create our store slice with default data and actions
export const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (set) => ({
  authToken: undefined,
  authEmail: "",
  setAuthToken: (value) => set({ authToken: value }),
  setAuthEmail: (value) => set({ authEmail: value.replace(/ /g, "") }),
  logout: () => set({ authToken: undefined, authEmail: "" }),
});

// a selector can be used to grab the full AuthenticationStore
export const authenticationStoreSelector = (state: RootStore) => ({
  authToken: state.authToken,
  authEmail: state.authEmail,
  isAuthenticated: isAuthenticatedSelector(state),
  setAuthToken: state.setAuthToken,
  setAuthEmail: state.setAuthEmail,
  logout: state.logout,
});

// selectors can also be used for derived values
export const isAuthenticatedSelector = (state: RootStore) => !!state.authToken;

export const validationErrorSelector = (state: RootStore) => {
  if (state.authEmail.length === 0) return "can't be blank";
  if (state.authEmail.length < 6) return "must be at least 6 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.authEmail)) return "must be a valid email address";
  return "";
};