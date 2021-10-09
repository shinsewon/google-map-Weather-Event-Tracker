import React, { memo } from 'react';
import { Icon } from '@iconify/react';
import fireIcon from '@iconify/icons-emojione/fire';

function HeaderComponent() {
  return (
    <div className="header-bar">
      <Icon icon={fireIcon} /> Xtream Weather Events
    </div>
  );
}

export default memo(HeaderComponent);
