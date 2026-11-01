import { useLocale } from '../../context/LocaleContext';
import type { Property } from '../../types';

interface PropertyRankingsProps {
  title: string;
  properties: Property[];
  variant?: 'worst';
}

export default function PropertyRankings({ title, properties, variant }: PropertyRankingsProps) {
  const { t } = useLocale();
  return (
    <section className={`card pc${variant === 'worst' ? ' red' : ''}`}>
      <h3>{title}</h3>
      {properties.map((property, index) => {
        const detail = t(property.negative ? 'property.detailNeg' : 'property.detail', {
          rate: property.rate,
          amount: property.amount,
        });
        return (
          <div className="pr" key={property.name}>
            <i>{index + 1}</i>
            <div>
              {property.name}
              <small>{property.negative ? <em>{detail}</em> : detail}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
}
