import { Outlet, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

import {
  LuUserCog,
  LuMapPin,
  LuUngroup,
  LuGroup,
  LuTractor,
} from "react-icons/lu";

export default function AdminLayout() {
  const location = useLocation();

  return (
    <>
      <h1> Admin</h1>

      <Nav variant="tabs">
        {LIST.map((item, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              as={Link}
              to={item.to}
              active={location.pathname === item.to}
            >
              {item.icon}
              {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <div className="container-fluid">
        <Outlet />
      </div>
    </>
  );
}

const LIST = [
  { to: "/admin", label: "Admin", icon: <LuUserCog className="me-2" /> },
  { to: "/admin/sites", label: "Sites", icon: <LuMapPin className="me-2" /> },
  {
    to: "/admin/typeparcs",
    label: "Typeparcs",
    icon: <LuUngroup className="me-2" />,
  },
  {
    to: "/admin/parcs",
    label: "Parcs",
    icon: <LuGroup className="me-2" />,
  },
  {
    to: "/admin/engins",
    label: "Engins",
    icon: <LuTractor className="me-2" />,
  },
];
