import { Nav } from "rsuite";
import HomeIcon from "@rsuite/icons/legacy/Home";

const Navbar = ({ active, onSelect }) => {
  return (
    <Nav
      appearance="subtle"
      activeKey={active}
      onSelect={onSelect}
      style={{ marginBottom: 10 }}
    >
      <Nav.Item eventKey="node">Node</Nav.Item>
      <Nav.Item eventKey="compare">Compare</Nav.Item>
      <Nav.Item eventKey="report">Report</Nav.Item>
    </Nav>
  );
};

export default Navbar;
