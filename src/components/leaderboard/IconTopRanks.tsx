import type { ReactNode } from "react";

const IconTopRanks = ({
  rank,
  children,
}: {
  rank: number;
  children: ReactNode;
}) => {
  const color = {
    primary: "",
    secondary: "",
  };

  switch (rank) {
    case 1:
      color.primary = "#E6C150";
      color.secondary = "#FFEE92";
      break;
    case 2:
      color.primary = "#C0C0C0";
      color.secondary = "#E4E4E4";

      break;
    case 3:
      color.primary = "#CD7F32";
      color.secondary = "#D1976E";
      break;
  }

  return (
    <>
      <svg className="absolute w-10 -top-6 left-4" viewBox="0 0 40 30">
        <defs>
          <path
            d="M143.052478,1162.80265 C143.24402,1164.35955 142.599462,1165.4576 141.337708,1165.77552 C140.167175,1166.07039 138.975341,1165.44845 138.539605,1164.31725 C138.046064,1163.03509 138.597372,1162.00759 140.27666,1161.12796 C139.164891,1160.0632 138.061242,1159.00749 137.008184,1158 C135.946072,1159.01243 134.847509,1160.06009 133.705462,1161.15012 C133.913219,1161.22862 134.041935,1161.27391 134.168621,1161.32523 C135.30976,1161.78818 135.90163,1163.06629 135.516511,1164.23266 C135.136477,1165.39102 133.888915,1166.07536 132.691944,1165.78049 C131.516351,1165.49165 130.722816,1164.3182 130.934626,1163.13972 C130.987324,1162.84686 130.877872,1162.76233 130.639716,1162.67576 C129.219856,1162.16652 127.80503,1161.64522 126.386131,1161.12995 C126.281746,1161.0917 126.170265,1161.07158 126,1161.02629 C126.063847,1161.17222 126.093239,1161.2477 126.128708,1161.31914 C127.375259,1163.78078 128.624845,1166.23949 129.859253,1168.70713 C129.993028,1168.97383 130.174426,1168.99295 130.419704,1168.99295 C134.791855,1168.98993 139.16686,1168.98691 143.537713,1169 C143.891413,1169.001 144.071805,1168.88929 144.227886,1168.57531 C145.446054,1166.13077 146.68451,1163.69619 147.915883,1161.25688 C147.948314,1161.19449 147.959462,1161.12203 148,1160.99623 C146.305519,1161.61515 144.673928,1162.20993 143.052402,1162.8027 L143.052478,1162.80265 Z"
            id="crown-path-1"
          ></path>
          <filter
            filterUnits="objectBoundingBox"
            height="372.7%"
            id="crown-filter-2"
            width="236.4%"
            x="-68.2%"
            y="-136.4%"
          >
            <feOffset
              dx="0"
              dy="0"
              in="SourceAlpha"
              result="shadowOffsetOuter1crown"
            ></feOffset>
            <feGaussianBlur
              in="shadowOffsetOuter1crown"
              result="shadowBlurOuter1crown"
              stdDeviation="5"
            ></feGaussianBlur>
            <feColorMatrix
              in="shadowBlurOuter1crown"
              type="matrix"
              values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0"
            ></feColorMatrix>
          </filter>
        </defs>
        <g
          fill="none"
          fillRule="evenodd"
          id="UFL-Post-Experience-Page"
          opacity="0.9"
          stroke="none"
          strokeWidth="1"
        >
          <g
            id="6-PLayer-Team-Score-W/-Leaderboards-Copy-2"
            transform="translate(-117.000000, -1149.000000)"
          >
            <g>
              <use
                fill="black"
                fillOpacity="1"
                filter="url(#crown-filter-2)"
                xlinkHref="#crown-path-1"
              ></use>
              <use
                fill={color.primary}
                fillRule="evenodd"
                xlinkHref="#crown-path-1"
              ></use>
            </g>
          </g>
        </g>
      </svg>
      {children}
      <svg
        className="absolute w-14 left-2"
        height="13px"
        version="1.1"
        viewBox="0 0 61 13"
        width="61px"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g
          fill="none"
          fillRule="evenodd"
          id="Leaderboards-(WIP)"
          stroke="none"
          strokeWidth="1"
        >
          <g
            id="Leaderboard-Logged-in-Player-01"
            transform="translate(-292.000000, -557.000000)"
          >
            <g id="Group-3" transform="translate(292.819007, 557.151268)">
              <path
                d="M0.83950534,12.348732 M59.3692662,12.348732 L53.5140131,0.5 L7.25809291,0.5 L0.83950534,12.348732 "
                fill="#1a1e29"
                id="Path-2"
                stroke="#31384d"
              ></path>
              <polygon
                fill={color.secondary}
                id="Eric-Bottom"
                points="9.152305 10.848732 51.5595872 10.848732 53.180993 12.848732 8.18099299 12.848732"
              ></polygon>
              <polygon
                fill={color.primary}
                id="Eric-Top"
                points="11.0659662 5.84873197 49.7037121 5.84873197 51.180993 7.84873197 10.180993 7.84873197"
              ></polygon>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

export default IconTopRanks;
