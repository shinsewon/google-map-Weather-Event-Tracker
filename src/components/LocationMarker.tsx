import React, { memo } from 'react';
import { Icon } from '@iconify/react';
import fireIcon from '@iconify/icons-emojione/fire';
import volcano from '@iconify/icons-emojione/volcano';
import stormIcon from '@iconify/icons-emojione/cloud-with-lightning-and-rain';
import iceIcon from '@iconify/icons-emojione/snowflake';

interface MarkerProps {
  id: number;
  lat: number;
  lng: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
}

export default memo(function LocationMarker({
  lat,
  lng,
  onClick,
  onKeyDown,
  id,
}: MarkerProps) {
  let renderIcon = null;
  if (id === 8) {
    renderIcon = fireIcon;
  }
  if (id === 10) {
    renderIcon = stormIcon;
  }
  if (id === 12) {
    renderIcon = volcano;
  }
  if (id === 15) {
    renderIcon = iceIcon;
  }

  return (
    <button type="button" onClick={onClick} onKeyDown={onKeyDown}>
      <Icon icon={renderIcon || ''} className="location-icon" />
    </button>
  );
});
