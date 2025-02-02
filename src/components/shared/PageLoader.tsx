import { FC, PropsWithChildren } from "react";
import { ClipLoader } from "react-spinners";

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
            fullHeight ? "h-screen" : `h-[70vh]`
          }`}
          style={!fullHeight ? { height: `${height}vh` } : undefined}
        >
          <ClipLoader color="#111827" size={64} speedMultiplier={0.75} />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default PageLoader;
