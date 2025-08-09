import type { ParentComponent } from "solid-js";
import { cn } from "~/lib/utils";

interface SpinnerProps {
  size?: number;
  class?: string;
}

const Spinner: ParentComponent<SpinnerProps> = (props) => {
  const size = props.size ?? 32;

  return (
    <div
      class={cn(`border-4 border-white/20 border-t-white rounded-full animate-spin`, props.class)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default Spinner;
