import assert from 'node:assert';
import { describe, it } from 'node:test';
import { fromShortHost, toShortHost } from './short-host.js';

/**
 * @param {string} host
 * @param {string} expectedShortHost
 */
function assertToShortHost(host, expectedShortHost) {
  const shortHost = toShortHost(host);
  assert.strictEqual(shortHost, expectedShortHost);
}

/**
 * @param {string} shortHost
 * @param {string} expectedHost
 */
function assertFromShortHost(shortHost, expectedHost) {
  const host = fromShortHost(shortHost);
  assert.strictEqual(host, expectedHost);
}

describe('toShortHost', () => {
  it('192.168.0.D (with D < 16) and 8080 => 1 chars', async () => {
    assertToShortHost('192.168.0.15:8080', 'p');
  });
  it('192.168.0.D and known port => 2 chars', async () => {
    assertToShortHost('192.168.0.27:8080', 'bw');
  });
  it('192.168.1.D and known port => 2 chars', async () => {
    assertToShortHost('192.168.1.182:5173', '3n');
  });
  it('192.168.0.D and other known port => 3 chars', async () => {
    assertToShortHost('192.168.0.27:4200', 'bwd');
  });
  it('192.168.1.D and other known port => 3 chars', async () => {
    assertToShortHost('192.168.1.85:3000', 'vkc');
  });
  it('192.168.1.D and port => 4 chars', async () => {
    assertToShortHost('192.168.1.111:443', 'w6os');
  });
  it('192.168.C.D and port => 5 chars', async () => {
    assertToShortHost('192.168.27.81:4444', 'dniqr');
  });
  it('192.168.C.D and port => 6 chars', async () => {
    assertToShortHost('192.168.27.81:7812', 'dnixuq');
  });
  it('A.B.C.D and port => 7 chars', async () => {
    assertToShortHost('4.15.167.243:8080', 'aqh2p4y');
  });
  it('A.B.C.D and port => 8 chars', async () => {
    assertToShortHost('4.15.167.243:123', 'aqh2p44s');
  });
  it('A.B.C.D and port => 9 chars', async () => {
    assertToShortHost('4.15.167.243:2345', 'aqh2p42j6');
  });
  it('A.B.C.D and port => 10 chars', async () => {
    assertToShortHost('4.15.167.243:56789', 'aqh2p4zxov');
  });
});

describe('fromShortHost', () => {
  it('1 chars => 192.168.0.D (with D < 16) and 8080', async () => {
    assertFromShortHost('p', '192.168.0.15:8080');
  });
  it('2 chars => 192.168.0.D and known port', async () => {
    assertFromShortHost('bw', '192.168.0.27:8080');
  });
  it('2 chars => 192.168.1.D and known port', async () => {
    assertFromShortHost('3n', '192.168.1.182:5173');
  });
  it('3 chars => 192.168.0.D and other known port', async () => {
    assertFromShortHost('bwd', '192.168.0.27:4200');
  });
  it('3 chars => 192.168.1.D and other known port', async () => {
    assertFromShortHost('vkc', '192.168.1.85:3000');
  });
  it('4 chars => 192.168.1.D and port', async () => {
    assertFromShortHost('w6os', '192.168.1.111:443');
  });
  it('5 chars => 192.168.C.D and port', async () => {
    assertFromShortHost('dniqr', '192.168.27.81:4444');
  });
  it('6 chars => 192.168.C.D and port', async () => {
    assertFromShortHost('dnixuq', '192.168.27.81:7812');
  });
  it('7 chars => A.B.C.D and port', async () => {
    assertFromShortHost('aqh2p4y', '4.15.167.243:8080');
  });
  it('8 chars => A.B.C.D and port', async () => {
    assertFromShortHost('aqh2p44s', '4.15.167.243:123');
  });
  it('9 chars => A.B.C.D and port', async () => {
    assertFromShortHost('aqh2p42j6', '4.15.167.243:2345');
  });
  it('10 chars => A.B.C.D and port', async () => {
    assertFromShortHost('aqh2p4zxov', '4.15.167.243:56789');
  });
});
