import cloudflare from '../.build/cloudflare.ts';

const components = cloudflare.result.components;

export const locations = components.filter(
  (component) => component.type === 'location',
);
export type Code = (typeof locations)[number]['location']['iata_code'];

// Fewer than 400 components fails to compile.
// Services are counted too, since filtering loses the tuple length.
void components[399];
