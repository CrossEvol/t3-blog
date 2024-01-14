type ContainerProps = {
  children: React.ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return <div className="container m-auto max-w-2xl px-4">{children}</div>;
};

export default Container;
