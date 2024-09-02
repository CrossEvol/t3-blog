type ContainerProps = {
  children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return <div className="container max-w-2xl mt-4">{children}</div>
}

export default Container
