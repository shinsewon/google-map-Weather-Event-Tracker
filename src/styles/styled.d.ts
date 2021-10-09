import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    flexCenter: {
      display: string;
      alignItems: string;
      justifyContent: string;
    };
    boxShadows: {
      dropShadow: string;
    };
  }
}
