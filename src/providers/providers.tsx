import { FC, PropsWithChildren } from "react";
import AuthProvider from "./auth.provider";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
