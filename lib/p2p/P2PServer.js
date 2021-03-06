const net = require('net');
const Logger = require('../Logger');
const assert = require('assert');

/** Class representing a server that accepts incoming peer connections */
class P2PServer {
  /** Create a server to accept incoming peer connections */
  constructor(p2p) {
    this.logger = Logger.global;
    this.p2p = p2p;
    this.server = net.createServer((peer) => {
      p2p.addPeer(peer);
      this.logger.debug(`peer ${peer.remoteAddress}:${peer.remotePort} connected`);
    });
    this.server.on('error', (err) => {
      this.logger.error(err);
    });
  }

  /**
   * Start listening for incoming connections on a given port.
   * @param {number} port
   */
  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');
    return new Promise((resolve, reject) => {
      this.server.listen(port, '0.0.0.0', () => {
        this.logger.info(`P2P server listening on port ${port}`);
        resolve(true);
      }).once('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Stop listening for incoming connections.
   */
  close() {
    this.server.close(() => { this.logger.info('P2P server closed'); }).once('error', (err) => {
      throw (err);
    });
    this.logger.info('P2P server stopped listening');
  }
}

module.exports = P2PServer;
