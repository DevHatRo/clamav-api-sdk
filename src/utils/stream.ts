import { Readable } from 'node:stream';

const DEFAULT_CHUNK_SIZE = 64 * 1024; // 64KB

/**
 * Async generator that yields Buffer chunks from a Readable stream.
 */
export async function* chunkStream(
  source: Readable,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): AsyncGenerator<Buffer> {
  let buffer = Buffer.alloc(0);

  for await (const data of source) {
    buffer = Buffer.concat([buffer, Buffer.isBuffer(data) ? data : Buffer.from(data)]);

    while (buffer.length >= chunkSize) {
      yield buffer.subarray(0, chunkSize);
      buffer = buffer.subarray(chunkSize);
    }
  }

  if (buffer.length > 0) {
    yield buffer;
  }
}

/**
 * Convert a Buffer into a Readable stream.
 */
export function bufferToStream(buf: Buffer): Readable {
  return Readable.from(buf);
}

/**
 * Collect all data from a Readable stream into a single Buffer.
 */
export async function streamToBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
