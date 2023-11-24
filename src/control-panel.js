import * as React from "react";

function Checkbox({ name, value, onChange }) {
  return (
    <div className="input">
      <label>{name}</label>
      <input
        type="checkbox"
        checked={value}
        onChange={(evt) => onChange(name, evt.target.checked)}
      />
    </div>
  );
}

function ControlPanel(props) {
  const { ltnVisibility, onLtnChange } = props;

  return (
    <div className="control-panel">
      <Checkbox name="LTNs" value={ltnVisibility} onChange={onLtnChange} />
    </div>
  );
}

export default React.memo(ControlPanel);
