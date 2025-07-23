type IconProps = {
  path: string;
  alt: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

function Icons({path, alt, ...props}:IconProps) {
  return <img src={path} alt={alt} {...props} />;
}

export default Icons
