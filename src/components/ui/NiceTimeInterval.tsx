export const NiceTimeInterval = ({ hours }: { hours: number }) => {
  if (hours < 25) {
    return <>{`Every ${hours} hour${hours === 1 ? "" : "s"}`}</>;
  }

  const days = Math.round(hours / 24);
  if (days < 31) {
    return <>{`Every ${days} day${days === 1 ? "" : "s"} (${hours} hour${hours === 1 ? "" : "s"})`}</>;
  }

  const weeks = Math.round(days / 7);

  if (weeks < 20) {
    return <>{`Every ${weeks} week${weeks === 1 ? "" : "s"} (${hours} hour${hours === 1 ? "" : "s"})`}</>;
  }

  const months = Math.round(days / 30);

  return <>{`Every ${months} months (${hours} hour${hours === 1 ? "" : "s"})`}</>;
};
