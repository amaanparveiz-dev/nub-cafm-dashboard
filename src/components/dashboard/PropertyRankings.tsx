import type { Property } from '../../types';

interface PropertyRankingsProps {
  title: string;
  properties: Property[];
  variant?: 'worst';
}

export default function PropertyRankings({ title, properties, variant }: PropertyRankingsProps) {
  return (
    <section className={`card pc${variant === 'worst' ? ' red' : ''}`}>
      <h3>{title}</h3>
      {properties.map((property, index) => (
        <div className="pr" key={property.name}>
          <i>{index + 1}</i>
          <div>
            {property.name}
            <small>{property.negative ? <em>{property.detail}</em> : property.detail}</small>
          </div>
        </div>
      ))}
    </section>
  );
}
