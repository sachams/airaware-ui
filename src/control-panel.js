import * as React from "react";

function Checkbox({ name, value, onChange }) {
  return (
    <div className="input">
      <input
        type="checkbox"
        checked={value}
        onChange={(evt) => onChange(name, evt.target.checked)}
      />
      <label>{name}</label>
    </div>
  );
}

function ControlPanel(props) {
  const {
    ltnVisibility,
    onLtnChange,
    boroughVisibility,
    onBoroughChange,
    onSeriesChange,
    seriesValue,
  } = props;

  return (
    <div className="control-panel">
      <div>
        <input
          type="radio"
          value="pm25"
          name="series"
          onChange={onSeriesChange}
          checked={seriesValue === "pm25"}
        />{" "}
        PM2.5
        <input
          type="radio"
          value="no2"
          name="series"
          onChange={onSeriesChange}
          checked={seriesValue === "no2"}
        />{" "}
        NO2
      </div>
      <Checkbox name="LTNs" value={ltnVisibility} onChange={onLtnChange} />
      <Checkbox
        name="Boroughs"
        value={boroughVisibility}
        onChange={onBoroughChange}
      />
    </div>
  );
}

export default React.memo(ControlPanel);
