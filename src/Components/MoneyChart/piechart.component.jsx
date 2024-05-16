import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

import bg1 from "../../assets/Background Card Images/IMG_3328.jpg";
import bg2 from "../../assets/Background Card Images/IMG_3327.jpg";
import bg3 from "../../assets/Background Card Images/IMG_3329.jpg";
import bg4 from "../../assets/Background Card Images/IMG_3330.jpg";
import bg5 from "../../assets/Background Card Images/IMG_3332.jpg";

const PieChart = ({ title, description, readedCards, deletedCards }) => {
  const colors = [bg1, bg2, bg3, bg4, bg5]; // array cu backgroundImage pentru card
  const bgImage = colors[Math.floor(Math.random() * colors.length)];

  const chartConfig = {
    type: "pie",
    width: 280,
    height: 280,
    series: [readedCards, deletedCards],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617", "#1e88e5"],
      legend: {
        show: false,
      },
      labels: ["Created Cards", "Deleted Cards"],
    },
  };

  return (
    <Card>
      <div
        className="w-full h-4 rounded-t-lg bg-clip-border bg-cover"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center px-4"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">2</div>
        <div>
          <Typography variant="h6" color="blue-gray">
            {title ? title : <span className="text-gray-400">No title</span>}
          </Typography>
          <Typography
            variant="small"
            color="gray"
            className="max-w-sm font-normal"
          >
            {description}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="mt-4 grid place-items-center px-2">
        <Chart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default PieChart;
