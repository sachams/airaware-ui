import * as React from "react";
import subDays from "date-fns/subDays";
import subYears from "date-fns/subYears";
import set from "date-fns/set";
import { DateRangePicker } from "rsuite";
const { afterToday } = DateRangePicker;

const defaultEndDate = set(new Date(), {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});

const predefinedRanges = [
  {
    label: "Last 7 days",
    value: [subDays(defaultEndDate, 7), defaultEndDate],
    placement: "left",
    appearance: "default",
  },
  {
    label: "Last 30 days",
    value: [subDays(defaultEndDate, 30), defaultEndDate],
    placement: "left",
  },
  {
    label: "Last 90 days",
    value: [subDays(defaultEndDate, 90), defaultEndDate],
    placement: "left",
  },
  {
    label: "Last year",
    value: [subYears(defaultEndDate, 1), defaultEndDate],
    placement: "left",
  },
];

function DateSelector({ dateRange, onChange }) {
  return (
    <DateRangePicker
      ranges={predefinedRanges}
      placeholder="Select date range"
      showOneCalendar
      cleanable={false}
      onChange={onChange}
      defaultValue={dateRange}
      size="sm"
      shouldDisableDate={afterToday()}
      style={{ width: "70%" }}
      onShortcutClick={(shortcut, event) => {
        console.log(shortcut);
      }}
    />
  );
}

export default DateSelector;
