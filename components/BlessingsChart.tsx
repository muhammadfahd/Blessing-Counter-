import React from 'react';
import { Blessing } from '../types';
import { CHART_COLORS } from '../constants';

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
    // To handle a full circle case where start and end angles are the same
    if (endAngle - startAngle >= 360) {
        endAngle = startAngle + 359.99;
    }

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "L", start.x, start.y
    ].join(" ");

    return d;
}

interface BlessingsChartProps {
  blessings: Blessing[];
}

const BlessingsChart: React.FC<BlessingsChartProps> = ({ blessings }) => {
  if (blessings.length < 2) return null;

  const totalCount = blessings.reduce((sum, b) => sum + b.count, 0);
  if (totalCount === 0) return null;

  let cumulativeAngle = 0;

  return (
    <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 font-serif text-center mb-4">Blessings Breakdown</h3>
        <div className="w-full max-w-xs mx-auto">
             <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {blessings.map((blessing, index) => {
                    if (blessing.count <= 0) return null;
                    
                    const percentage = (blessing.count / totalCount) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = cumulativeAngle;
                    const endAngle = cumulativeAngle + angle;
                    cumulativeAngle += angle;
                    
                    const color = CHART_COLORS[index % CHART_COLORS.length];
                    
                    return (
                        <path
                            key={blessing.id}
                            d={describeArc(50, 50, 50, startAngle, endAngle)}
                            fill={color}
                        />
                    );
                })}
            </svg>
        </div>
    </div>
  );
};

export default BlessingsChart;