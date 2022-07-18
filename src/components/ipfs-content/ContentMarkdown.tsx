import { useWeb3Storage } from "../../hooks/useWeb3Storage";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import ReactMarkdown from "react-markdown";

interface ContentMarkdownProps {
  cid?: string;
}

export const useContentMarkdown = (cid: string | undefined) => {
  const { getJson } = useWeb3Storage();
  const [content, setContent] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => getContent(), [cid]);

  const getContent = () => {
    if (!cid) {
      return;
    }

    setLoading(true);
    getJson(cid)
      .then((result: any) => {
        try {
          if (typeof result === "string") {
            setContent(result);
          } else {
            setContent(JSON.parse(result));
          }
        } catch (e: any) {
          console.log("Could not parse JSON", e);
          setContent("");
        }
      })
      .finally(() => setLoading(false));
  };

  return {
    content,
    loading,
  };
};

export const ContentMarkdown = ({ cid }: ContentMarkdownProps) => {
  const { getJson } = useWeb3Storage();
  const [content, setContent] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!cid) {
      return;
    }

    setLoading(true);
    getJson(cid)
      .then((result: any) => {
        try {
          if (typeof result === "string") {
            setContent(result);
          } else {
            setContent(JSON.parse(result));
          }
        } catch (e: any) {
          console.log("Could not parse JSON", e);
          setContent("");
        }
      })
      .catch((err: any) => {
        console.error(err);
        setContent("");
      })
      .finally(() => setLoading(false));
  }, [cid]);

  if (!cid) {
    return null;
  }

  if (isLoading) {
    return <Skeleton variant="text" height={50} />;
  }

  return <ReactMarkdown>{content}</ReactMarkdown>;
};
