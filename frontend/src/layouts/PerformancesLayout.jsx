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

export default function PerformancesLayout() {
  const location = useLocation();

  return (
    <>
      <h1> Performances</h1>

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
  {
    to: "/performances",
    label: "Performances",
    icon: <LuUserCog className="me-2" />,
  },
  {
    to: "/performances/saisierje",
    label: "Saisie RJE",
    icon: <LuMapPin className="me-2" />,
  },
];
