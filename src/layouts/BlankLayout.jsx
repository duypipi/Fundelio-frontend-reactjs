import { Outlet } from 'react-router-dom';

/**
 * Blank layout component (no header/footer)
 * Used for full-screen pages like editor or dashboard
 */
export default function BlankLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
