import { FC, PropsWithChildren } from "react";

interface PageLoaderProps {
  fullHeight?: boolean;
  height?: number; // like 70 or 50 as in 70% or 50%
  loading?: boolean;
}

const PageLoader: FC<PropsWithChildren<PageLoaderProps>> = ({
  fullHeight = false,
  height = 70,
  loading = false,
  children,
}) => {
  return (
    <>
      {loading ? (
        <div
          className={`flex items-center justify-center ${
            fullHeight ? "h-screen" : `h-[${height}vh]`
          }`}
        >
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default PageLoader;
