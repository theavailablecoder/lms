import CompanyBrand from "./CompanyBrand.jsx";

export default function PageLoader({
  title = "Loading page",
  message = "Please wait while we prepare your content...",
}) {
  return (
    <div className="searchLoading eduPageLoader" role="status" aria-live="polite" aria-atomic="true">
      <div className="eduLoaderCard">
        <CompanyBrand />
        <div className="eduLoaderTrack" aria-hidden="true"><span /></div>
        <strong>{title}</strong>
        <p>{message}</p>
        <span className="eduLoaderDots" aria-hidden="true"><i /><i /><i /></span>
      </div>
    </div>
  );
}
