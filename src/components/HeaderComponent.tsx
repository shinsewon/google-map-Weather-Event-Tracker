import React, { memo } from 'react';
import { Icon } from '@iconify/react';
import fireIcon from '@iconify/icons-emojione/fire';

function HeaderComponent() {
  return (
    <div className="header-bar">
      <Icon icon={fireIcon} /> 각 세계별 날씨 이벤트
    </div>
  );
}

export default memo(HeaderComponent);
