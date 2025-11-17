import { Spinner } from "@radix-ui/themes";

const LoadingSpinner = () => {
  return (
    <div className="centered-div">
      <div className="">
        <Spinner className="w-full h-full" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
