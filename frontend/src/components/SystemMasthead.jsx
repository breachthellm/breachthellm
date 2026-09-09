function SystemMasthead({ crumb, packName }) {
  return (
    <div className="app-breadcrumb">
      <span className="app-name">{packName}</span>
      {crumb && (
        <>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{crumb}</span>
        </>
      )}
    </div>
  );
}

export default SystemMasthead;
