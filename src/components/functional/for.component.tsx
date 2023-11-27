interface ForProps {
  count: number;
  render: (index: number) => React.ReactNode;
}

export const For: React.FC<ForProps> = ({ count, render }) => {
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    elements.push(render(i));
  }

  return <>{elements}</>;
};
