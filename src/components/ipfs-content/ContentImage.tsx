interface ContentImageProps {
  cid?: string;
}

export const ContentImage = ({ cid }: ContentImageProps) => {
  return <img src={`https://${cid}.ipfs.dweb.link`} alt="" />;
};
