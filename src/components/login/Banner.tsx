import type { BannerState, BannerType } from '../../types';
import Icon from '../common/Icon';
import type { IconName } from '../common/Icon';

const BANNER_ICONS: Record<BannerType, IconName> = { error: 'alert', info: 'info', success: 'check' };

/** Status message. `banner` is `{ type: 'error' | 'info' | 'success', message }` or null. */
export default function Banner({ banner }: { banner: BannerState | null }) {
  return (
    <div className="banner-slot">
      {banner && (
        <div className="banner" data-type={banner.type} role={banner.type === 'error' ? 'alert' : 'status'}>
          <Icon name={BANNER_ICONS[banner.type]} className="lg-ic" />
          <p>{banner.message}</p>
        </div>
      )}
    </div>
  );
}
