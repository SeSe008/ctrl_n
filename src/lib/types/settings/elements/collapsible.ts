import type { GroupProps } from ".";

export interface Options extends GroupProps {
  collapsed?: boolean;
  title: string;
  collapseIcon?: string;
  expandIcon?: string;
}
