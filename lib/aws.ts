import aws from '../.build/aws.ts';

export const locations = aws.edge_locations;
export type Code = (typeof locations)[number]['iata_code'];

// Fewer than 100 locations fails to compile.
void locations[99];
