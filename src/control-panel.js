import * as React from "react";
import { Radio, RadioGroup, CheckPicker } from "rsuite";
import "./control-panel.css";

const styles = {
  radioGroup: {
    margin: "0px 0px 5px",
  },
  radio: {
    padding: "5px 5px 5px",
  },
};

function ControlPanel(props) {
  const { onSeriesChange, seriesValue, featureData, onFeaturesChange } = props;

  return (
    <div className="control-panel">
      <RadioGroup
        onChange={onSeriesChange}
        name="series"
        inline
        appearance="picker"
        defaultValue={seriesValue}
        style={styles.radioGroup}
      >
        <Radio style={styles.radio} value="pm25">
          PM2.5
        </Radio>
        <Radio style={styles.radio} value="no2">
          NO2
        </Radio>
      </RadioGroup>
      <CheckPicker
        onChange={onFeaturesChange}
        placeholder="Features"
        data={featureData}
        size="xs"
      />
    </div>
  );
}

export default React.memo(ControlPanel);
