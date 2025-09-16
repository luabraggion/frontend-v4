'use client';

import { Wheel, type WheelOption } from '@/components/feedback/Wheel';
import React from 'react';

export interface RoletaCanvasProps {
  options: WheelOption[];
  title?: string;
  wheelSize?: number;
  durationMs?: number;
  spins?: number;
  spinButtonLabel?: string;
  spinButtonSpinningLabel?: string;
  showSpinButton?: boolean;
  onFinish?: (opt: WheelOption) => void;
  externalSpinRef?: React.Ref<(opts?: { forceIndex?: number }) => void>;
  onTitleClick?: () => void;
  titleSvgProps?: React.SVGProps<SVGSVGElement>;
}

const ArcTitle = React.forwardRef<
  SVGSVGElement,
  { text: string; svgProps?: React.SVGProps<SVGSVGElement> }
>(({ text, svgProps }, ref) => {
  const id = '_r_0_';
  return (
    <svg ref={ref} width={250} height={50} viewBox="0 0 180 1" aria-hidden="true" {...svgProps}>
      <defs>
        <path id={id} d="M -13 100 A 80 80 0 0 1 187 100" fill="transparent" />
      </defs>
      <text fill="#111827" fontSize={16} fontWeight={700}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
});
ArcTitle.displayName = 'RoletaArcTitle';

export const RoletaCanvas: React.FC<RoletaCanvasProps> = ({
  options,
  title = 'Roleta da Sorte',
  wheelSize = 315,
  durationMs = 7000,
  spins = 8,
  spinButtonLabel = 'Sortear Prêmio',
  spinButtonSpinningLabel = 'Sorteando…',
  showSpinButton = true,
  onFinish,
  externalSpinRef,
  onTitleClick,
  titleSvgProps,
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        style={{ marginBottom: 0, cursor: onTitleClick ? 'pointer' : undefined }}
        onClick={onTitleClick}
        title={onTitleClick ? 'Clique para girar' : undefined}
      >
        <ArcTitle ref={svgRef} text={title} svgProps={titleSvgProps} />
      </div>
      <Wheel
        options={options}
        size={wheelSize}
        durationMs={durationMs}
        spins={spins}
        spinButtonLabel={spinButtonLabel}
        spinButtonSpinningLabel={spinButtonSpinningLabel}
        showSpinButton={showSpinButton}
        onFinish={onFinish}
        externalSpinRef={externalSpinRef}
      />
    </div>
  );
};

// Exemplo de uso do componente RoletaCanvas
export const RoletaCanvasDemo = () => {
  const options: WheelOption[] = [
    { label: 'Prêmio 1', color: '#ff914d' },
    { label: 'Prêmio 2', color: '#e45d56' },
    { label: 'Prêmio 3', color: '#bb2f5d' },
    { label: 'Prêmio 4', color: '#87095e' },
    { label: 'Prêmio 5', color: '#4b0056' },
    { label: 'Prêmio 6', color: '#4e3d8f' },
    { label: 'Prêmio 7', color: '#3f6ec1' },
    { label: 'Camisa do São Paulo Futebol Clube', color: '#1b9ee6' },
    // { label: 'Prêmio 9', color: '#F79EB1' },
    // { label: 'Prêmio 10', color: '#ae8fba' },
  ];

  return <RoletaCanvas options={options} />;
};

export default RoletaCanvas;
