// components/icons/Icon1.tsx
import React from 'react';

interface IconProps {
  size: number;
}

const Icon1: React.FC<IconProps> = ({ size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1700 1700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="850" cy="850" r="850" fill="#8FE6A4" />
      <circle
        cx="672.954"
        cy="674.073"
        r="90.6667"
        transform="rotate(180 672.954 674.073)"
        fill="#34C759"
      />
      <circle
        cx="1028.56"
        cy="674.073"
        r="90.6667"
        transform="rotate(180 1028.56 674.073)"
        fill="#34C759"
      />
      <path
        d="M555.346 886.194C555.346 925.178 563.025 963.78 577.943 999.796C592.862 1035.81 614.728 1068.54 642.294 1096.1C669.86 1123.67 702.585 1145.54 738.602 1160.45C774.618 1175.37 813.221 1183.05 852.204 1183.05C891.188 1183.05 929.791 1175.37 965.807 1160.45C1001.82 1145.54 1034.55 1123.67 1062.11 1096.1C1089.68 1068.54 1111.55 1035.81 1126.47 999.796C1141.38 963.78 1149.06 925.178 1149.06 886.194L852.204 886.194H555.346Z"
        fill="#34C759"
      />
      <path
        d="M971.939 214.953C1131.47 244.636 1274.1 332.99 1371.73 462.607C1469.36 592.224 1514.91 753.705 1499.4 915.234C1483.88 1076.76 1408.44 1226.62 1287.93 1335.29C1167.42 1443.96 1010.58 1503.56 848.312 1502.34C686.045 1501.12 530.118 1439.17 411.254 1328.7C292.389 1218.24 219.207 1067.26 206.125 905.514C193.043 743.771 241.01 582.992 340.576 454.857C440.143 326.722 584.087 240.522 744.049 213.24L765.877 341.228C637.908 363.053 522.752 432.014 443.099 534.522C363.446 637.03 325.072 765.652 335.538 895.047C346.003 1024.44 404.549 1145.22 499.641 1233.6C594.733 1321.97 719.474 1371.53 849.287 1372.51C979.101 1373.48 1104.57 1325.81 1200.98 1238.87C1297.39 1151.94 1357.75 1032.05 1370.16 902.823C1382.56 773.6 1346.13 644.415 1268.02 540.721C1189.92 437.028 1075.82 366.344 948.189 342.598L971.939 214.953Z"
        fill="white"
      />
    </svg>
  );
};

export default Icon1;