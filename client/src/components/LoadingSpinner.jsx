import { Oval, ThreeDots } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen scale-105 duration-200">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#2563eb"
        secondaryColor="#93c5fa"
        strokeWidth={4}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export const ThreeDotsLoader = ({ height = "80", color = "#2563eb" }) => (
  <div
    style={{ minHeight: `${height}vh` }}
    className="flex justify-center items-center">
    <ThreeDots
      height="50"
      width="50"
      color={color}
      ariaLabel="three-dots-loading"
      visible={true}
    />
  </div>
);

export default LoadingSpinner;
