import "echarts/lib/component/dataset";
import "echarts/lib/chart/gauge";

import { objectGet } from "@coloration/kit";

export const renderer = (instance, opt) => {
  const clr = objectGet(
    ["orange", "steelblue", "pink", "green", "#cd164e"],
    opt,
    "colors"
  );
  // const richStyle = clr.reduce((r, c, i) => {
  //   r[i] = {
  //     color: c,
  //     fontSize: 16,
  //     align: 'center',
  //     fontWeight: 'bold'
  //   }
  //   return r
  // }, {
  //   name: {
  //     fontSize: 14,
  //     align: 'center',
  //     marginTop: 4,
  //     padding: [4, 0, 0, 0]
  //   },
  // })

  const data = opt.data;

  // const sum = data.reduce((s, d) => s + d.value, 0)

  const option = {
    color: clr,
    series: [
      {
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, "#FEE46A"],
              [0.7, "#01FBB7"],
              [1, "#FF4747"],
            ],
            shadowColor: 'rgba(255, 255, 255, .3)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 2
          },
        },

        pointer: {
          length: '120%',
          itemStyle: {
            color: "#F3F3F3",
          },
        },
        axisTick: {
          distance: -39,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -42,
          length: 12,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          
          color: "auto",
          distance: 0,
          fontSize: 12,
          formatter (v) {
            return v % 100 === 0 ? v : ''
          }
        },
        detail: {
          formatter: function () {
            return '';
          },
        },
        data: [
          {
            value: data,
          },
        ],
      },
    ],
  };

  instance.echart.setOption(option);
};
