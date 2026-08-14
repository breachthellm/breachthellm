function SystemMasthead({ crumb }) {
  return (
    <div className="app-breadcrumb">
      <span className="app-name">Veyra Shield</span>
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
