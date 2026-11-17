import fastly from '../.build/fastly.ts';

export const datacenters = fastly;
export type Code = (typeof datacenters)[number]['code'];

// Fewer than 180 datacenters fails to compile.
void datacenters[179];
