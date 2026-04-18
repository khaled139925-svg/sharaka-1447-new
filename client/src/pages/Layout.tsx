import React from 'react';
import MenuDrawer from './MenuDrawer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <MenuDrawer />
      <div style={{ paddingTop: '60px' }}>{children}</div>
    </div>
  );
};

export default Layout;