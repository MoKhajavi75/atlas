declare module 'react-simple-maps' {
  import { ReactNode } from 'react';

  export interface Geography {
    rsmKey: string;
    properties: {
      NAME?: string;
      NAME_LONG?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (args: { geographies: Geography[] }) => ReactNode;
    onError?: (error: Error) => void;
  }

  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<any>;
  export const ComposableMap: React.FC<any>;
  export const ZoomableGroup: React.FC<any>;
}

