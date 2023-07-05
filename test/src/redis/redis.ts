import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService extends Redis {

  constructor() {
    super();

    super.on('error', (err) => {
      console.log('Error on Redis');

    })

    super.on('connect', () => {
      console.log('Redis Connected!');
    });
  }

  async addNode(id: string, name: string): Promise<void> {
    await super.hset('nodes', id, name);
  }

  async addEdge(nodeId: string, connectedNodeId: string): Promise<void> {
    await super.sadd(`edges:${nodeId}`, connectedNodeId);
  }

  async getNodeName(id: string): Promise<string> {
    return await super.hget('nodes', id);
  }

  async getConnectedNodes(nodeId: string): Promise<string[]> {
    return await super.smembers(`edges:${nodeId}`);
  }

  async getAllNodes(): Promise<{ [id: string]: string }> {
    return await super.hgetall('nodes');
  }

  async deleteNode(id: string): Promise<number> {
    return await super.hdel('nodes', id);
  }

  async deleteEdge(nodeId: string, connectedNodeId: string): Promise<number> {
    return await super.srem(`edges:${nodeId}`, connectedNodeId);
  }

  async getNodeCount(): Promise<number> {
    return await super.hlen('nodes');
  }

  async getEdgeCount(nodeId: string): Promise<number> {
    return await super.scard(`edges:${nodeId}`);
  }

  async getAllEdges(): Promise<{ [nodeId: string]: string[] }> {
    const nodeIds = await this.getAllNodeIds();
    const edges: { [nodeId: string]: string[] } = {};

    for (const nodeId of nodeIds) {
      edges[nodeId] = await this.getConnectedNodes(nodeId);
    }

    return edges;
  }

  async getAllNodeIds(): Promise<string[]> {
    return await super.hkeys('nodes');
  }

  async isConnected(nodeId: string, connectedNodeId: string): Promise<boolean> {
    const connectedNodes = await this.getConnectedNodes(nodeId);
    return connectedNodes.includes(connectedNodeId);
  }
  async setKeyValue(key: string, value: string): Promise<void> {
    await super.set(key, value);
  }

  async getKey(key: string): Promise<string | null> {
    return await super.get(key);
  }

  async deleteKey(key: string): Promise<number> {
    return await super.del(key);
  }

  async hashSet(key: string, field: string, value: string): Promise<number> {
    return await super.hset(key, field, value);
  }

  async hashGet(key: string, field: string): Promise<string | null> {
    return await super.hget(key, field);
  }

  async hashGetAll(key: string): Promise<{ [field: string]: string }> {
    return await super.hgetall(key);
  }

  async hashDelete(key: string, field: string): Promise<number> {
    return await super.hdel(key, field);
  }

  async setAdd(key: string, member: string): Promise<number> {
    return await super.sadd(key, member);
  }

  async setMembers(key: string): Promise<string[]> {
    return await super.smembers(key);
  }

  async setRemove(key: string, member: string): Promise<number> {
    return await super.srem(key, member);
  }

  async keyExists(key: string): Promise<number> {
    return await super.exists(key);
  }

  async expireKey(key: string, seconds: number): Promise<number> {
    return await super.expire(key, seconds);
  }

  async ttlKey(key: string): Promise<number> {
    return await super.ttl(key);

  }

  async subtractValueFromKey(key: string, valueToSubtract: number): Promise<number | null> {
    const currentValue = await this.getKey(key);

    if (currentValue === null) {
      return null; // A chave não existe no Redis
    }

    const parsedValue = parseInt(currentValue);
    const result = parsedValue - valueToSubtract;

    await this.setKeyValue(key, result.toString()); // Atualiza o valor da chave no Redis

    return result;
  }

}

