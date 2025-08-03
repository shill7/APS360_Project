import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

function SemiCircle({ points, maxPoints }) {
  const ref = useRef();

  useEffect(() => {
    const percent = (points / maxPoints) * 100;
    const w = 150, h = 150;
    const outerRadius = w / 2 - 10;
    const innerRadius = 75;

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0)
        .endAngle(Math.PI);

    const arcLine = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(0);


    d3.select(ref.current).selectAll('*').remove();

    const colorScale = d3.scaleLinear()
        .domain([0, 45, 100]) 
        .range(['#4caf50', '#ffeb3b', '#ea1818ff']); 


    const svg = d3.select(ref.current)
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', `translate(${w / 2}, ${h / 2})`);

    svg.append('path')
        .attr('d', arc)
        .attr('transform', 'rotate(-90)')
        .style('fill', '#ececec');

    const foreground = svg.append('path')
        .datum({ endAngle: 0 })
        .attr('d', arcLine)
        .attr('transform', 'rotate(-90)')
        .style('fill', 'rgba(156,78,176,1)');

    const middleCount = svg.append('text')
        .datum(0)
        .text('0')
        .attr('text-anchor', 'middle')
        .attr('dy', 10)
        .style('fill', '#000')
        .style('font-size', '28px');

    // Animate
    foreground.transition()
        .duration(1300)
        .attrTween('d', function (d) {
            const interpolate = d3.interpolate(d.endAngle, Math.PI * (percent / 100));
            const interpolateCount = d3.interpolate(0, points);
            return function (t) {
                d.endAngle = interpolate(t);

                const currentPoints = interpolateCount(t);
                const currentPercent = (currentPoints / maxPoints) * 100;
                const currentColor = colorScale(currentPercent);

                middleCount.text(Math.floor(currentPoints) + '%');
                foreground.style('fill', currentColor);

                return arcLine(d);
            };
        });
  }, [points, maxPoints]);

  return <div ref={ref} />;
}

export default SemiCircle;
