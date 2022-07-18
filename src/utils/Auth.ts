export const isRoutePublic = (path: string): boolean => {
  return !["/create", "/recurring", "/account"].includes(path);
};
