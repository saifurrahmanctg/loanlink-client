import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

export default function DocumentTitle({ title, children }) {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    let dynamicTitle = title;

    // Example: replace :id in title for dynamic routes
    if (params?.id && title?.includes(":id")) {
      dynamicTitle = title.replace(":id", params.id);
    }

    document.title = dynamicTitle ? `${dynamicTitle} | LoanLink` : "LoanLink";
  }, [location.pathname, title, params]);

  return children;
}
