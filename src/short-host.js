const DICTIONNARY = 'abcdefghijklmnopqrstuvwxyz234567'.split('');

const CLASSIC_DEV_PORTS = [
  // Classic 80 local alternative
  8080,
  // Vite
  5173,
  // Ruby on Rails, Meteor, Grafana, Next, Nuxt...
  3000,
  // Angular
  4200,
  // Django, Python 3 HTTP Server
  8000,
  // PHP-FPM
  9000,
  // ASP, Flask
  5000,
  // Some 808X
  ...createArray(7).map((_, i) => i + 8081),
  // All XXXX
  ...createArray(9).map((_, i) => Number(String(i + 1).repeat(4))),
];

const PORTS = createArray(2 ** 16)
  .map((_, i) => i)
  .sort((a, b) => {
    if (CLASSIC_DEV_PORTS.includes(a) && !CLASSIC_DEV_PORTS.includes(b)) {
      return -1;
    }
    if (!CLASSIC_DEV_PORTS.includes(a) && CLASSIC_DEV_PORTS.includes(b)) {
      return 1;
    }
    if (CLASSIC_DEV_PORTS.includes(a) && CLASSIC_DEV_PORTS.includes(b)) {
      return CLASSIC_DEV_PORTS.indexOf(a) - CLASSIC_DEV_PORTS.indexOf(b);
    }
    return a - b;
  });

/**
 * @param {string} host
 * @return {string|null}
 */
export function toShortHost(host) {
  const [ipString, portString] = host.split(':');
  const [ipA, ipB, ipC, ipD] = ipString.split('.').map((strPart) => Number(strPart));
  const port = Number(portString);
  if (port > 2 ** 16) {
    return null;
  }
  const portIndex = PORTS.indexOf(port);

  if ([ipA, ipB, ipC, ipD, port].some((nb) => Number.isNaN(nb))) {
    return null;
  }

  const cdBinary = toBinary(ipC) + toBinary(ipD);

  if (ipA === 192 && ipB === 168) {
    if (ipC === 0 || ipC === 1) {
      const ipCBinary = ipC === 0 ? '0' : '1';
      if (ipD < 2 ** 4 && port === PORTS[0]) {
        // 1 chars
        return toBase32(ipCBinary + toBinary(ipD, 4));
      } else if (PORTS.indexOf(port) < 2 ** 1) {
        // 2 chars
        return toBase32(ipCBinary + toBinary(ipD) + toBinary(portIndex, 1));
      } else if (PORTS.indexOf(port) < 2 ** 6) {
        // 3 chars
        return toBase32(ipCBinary + toBinary(ipD) + toBinary(portIndex, 6));
      } else if (PORTS.indexOf(port) < 2 ** 11) {
        // 4 chars
        return toBase32(ipCBinary + toBinary(ipD) + toBinary(portIndex, 11));
      }
    }
    if (PORTS.indexOf(port) < 2 ** 9) {
      // 5 chars
      return toBase32(cdBinary + toBinary(portIndex, 9));
    } else if (PORTS.indexOf(port) < 2 ** 14) {
      // 6 chars
      return toBase32(cdBinary + toBinary(portIndex, 14));
    }
  }

  if (PORTS.indexOf(port) < 2 ** 3) {
    // 7 chars
    return toBase32(toBinary(ipA) + toBinary(ipB) + cdBinary + toBinary(portIndex, 3));
  } else if (PORTS.indexOf(port) < 2 ** 8) {
    // 8 chars
    return toBase32(toBinary(ipA) + toBinary(ipB) + cdBinary + toBinary(portIndex));
  } else if (PORTS.indexOf(port) < 2 ** 13) {
    // 9 chars
    return toBase32(toBinary(ipA) + toBinary(ipB) + cdBinary + toBinary(portIndex, 13));
  }

  // 10 chars
  return toBase32(toBinary(ipA) + toBinary(ipB) + cdBinary + toBinary(portIndex, 18));
}

/**
 * @param {string} shortHost
 * @return {string|null}
 */
export function fromShortHost(shortHost) {
  const charsAsNumbers = shortHost.split('').map((char) => DICTIONNARY.indexOf(char));

  if (charsAsNumbers.some((nb) => nb === -1)) {
    return null;
  }

  const binaryString = charsAsNumbers.map((nb) => toBinary(nb, 5)).join('');

  if (shortHost.length <= 0) {
    return null;
  } else if (shortHost.length <= 1) {
    const shortIpC = binaryString[0];
    const ipD = fromBinary(binaryString, 1, 5);
    return `192.168.${shortIpC}.${ipD}:${PORTS[0]}`;
  } else if (shortHost.length <= 4) {
    const shortIpC = binaryString[0];
    const ipD = fromBinary(binaryString, 1, 9);
    const portIndex = fromBinary(binaryString, 9);
    return `192.168.${shortIpC}.${ipD}:${PORTS[portIndex]}`;
  }
  if (shortHost.length <= 6) {
    const ipC = fromBinary(binaryString, 0, 8);
    const ipD = fromBinary(binaryString, 8, 16);
    const portIndex = fromBinary(binaryString, 16);
    return `192.168.${ipC}.${ipD}:${PORTS[portIndex]}`;
  }
  const ipA = fromBinary(binaryString, 0, 8);
  const ipB = fromBinary(binaryString, 8, 16);
  const ipC = fromBinary(binaryString, 16, 24);
  const ipD = fromBinary(binaryString, 24, 32);
  const portIndex = fromBinary(binaryString, 32);
  const port = PORTS[portIndex];
  if (port == null) {
    return null;
  }
  return `${ipA}.${ipB}.${ipC}.${ipD}:${port}`;
}

/**
 * @param {number} length
 * @return {Array<any>}
 */
function createArray(length) {
  return Array.from(new Array(length));
}

/**
 * @param {number} nb
 * @param {number} [bitLength=8]
 * @return {string}
 */
function toBinary(nb, bitLength = 8) {
  return nb.toString(2).padStart(bitLength, '0');
}

/**
 * @param {string} binaryString
 * @return {string}
 */
function toBase32(binaryString) {
  let chars = '';
  for (let i = 0; i < binaryString.length; i += 5) {
    const charBinary = binaryString.substring(i, i + 5);
    const charIndex = fromBinary(charBinary, 0, 5);
    chars += DICTIONNARY[charIndex];
  }
  return chars;
}

/**
 * @param {string} binaryString
 * @param {number} start
 * @param {number} [end]
 * @return {number}
 */
function fromBinary(binaryString, start, end) {
  const subString = binaryString.substring(start, end);
  return parseInt(subString, 2);
}
