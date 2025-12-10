/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
/// <reference types="@react-three/postprocessing" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      group: any;    
    }
  }
}

export {};
