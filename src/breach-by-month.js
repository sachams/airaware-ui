import axios from "axios";
import * as React from "react";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import "./breach-by-month.css";
import { Loader } from "rsuite";
import { getSeriesName, formatMonthYear } from "./utils";
import { set } from "date-fns";
import { primaryNodeColour } from "./mapStyle";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function BreachByMonth(props) {
  const { primaryNode, series, dateRange, threshold } = props;

  const containerRef = useRef();
  const [primaryData, setPrimaryData] = useState([]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching primary calendar series data from server");
        setIsLoading(true);

        // Load all the data asynchronously and wait for the result
        const [primaryData] = await Promise.all([
          axios.get(
            `${serverUrl}/sensor/${series}/${startDate.toISOString()}/${endDate.toISOString()}/day?codes=${
              primaryNode.site_code
            }`
          ),
        ]);

        const data = primaryData.data.map((d) => ({
          time: new Date(d.time),
          value: d.value,
        }));

        setIsLoading(false);
        setPrimaryData(data);
      } catch (error) {
        console.error("Error fetching primary calendar series data:", error);
      }
    };

    if (primaryNode) {
      loadData();
    }
  }, [primaryNode, series, startDate, endDate, threshold]);

  useEffect(() => {
    if (primaryData.length == 0) return;

    const plot = Plot.plot({
      style: {
        fontSize: 14,
      },
      title: `${getSeriesName(series)} number of daily breaches`,
      marginLeft: 60,
      marginBottom: 40,
      x: {
        type: "band",
      },
      y: {
        label: `${getSeriesName(series)} number of WHO breaches`,
        labelAnchor: "center",
        nice: true,
        ticks: 3,
      },

      marks: [
        Plot.axisX({
          label: null,
          tickFormat: formatMonthYear,
          tickSize: 2,
          lineWidth: 3,
        }),
        Plot.barY(
          primaryData,
          Plot.groupX(
            { y: "sum" },

            {
              x: (d) =>
                set(d.time, {
                  date: 1,
                  hours: 0,
                  minutes: 0,
                  seconds: 0,
                  milliseconds: 0,
                }),
              y: (d) => (d.value > threshold ? 1 : 0),
              fill: primaryNodeColour,
              tip: true,
            }
          )
        ),
      ],
    });

    containerRef.current.append(plot);
    return () => plot.remove();
  }, [primaryData]);

  return (
    <div>
      <div className="breach-calendar" ref={containerRef} />
      {isLoading && <Loader size="md" center />}
    </div>
  );
}

export default React.memo(BreachByMonth);
