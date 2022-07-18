export const Debug = ({ input }: { input: any }) => {
  return <pre>{JSON.stringify(input, null, 2)}</pre>;
};
