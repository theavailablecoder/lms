import logoUrl from '../../assets/aklogo.png';

export default function CompanyBrand({ compact = false }) {
  return (
    <span className={`akCompanyBrand ${compact ? 'akCompanyBrandCompact' : ''}`}>
      <svg className="akCompanyLogo" viewBox={compact ? '140 185 165 230' : '140 185 640 230'} role="img" aria-label="AKTech" preserveAspectRatio="xMidYMid meet">
        <image href={logoUrl} x="0" y="0" width="919" height="612" />
      </svg>
      {!compact && <strong className="akPlatformName">Edu<span>Hub</span></strong>}
    </span>
  );
}
