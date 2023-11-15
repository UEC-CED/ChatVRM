import { KnownIconType } from "@charcoal-ui/icons";
import { ButtonHTMLAttributes } from "react";
import { Tooltip } from 'react-tooltip'
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  iconName: keyof KnownIconType;
  isProcessing: boolean;
  label?: string;
  description?: string;
};

export const IconButton = ({
  iconName,
  isProcessing,
  label,
  description,
  ...rest
}: Props) => {
  return (
    <button
    data-tooltip-id="my-tooltip" data-tooltip-content={description}
      {...rest}
      className={`bg-primary hover:bg-primary-hover active:bg-primary-press disabled:bg-primary-disabled text-white rounded-16 text-sm p-8 text-center inline-flex items-center mr-2
        ${rest.className}
      `}
    >
      {label && <div className="mx-4 font-bold">{label}</div>}
      {isProcessing ? (
        <pixiv-icon name={"24/Dot"} scale="1"></pixiv-icon>
        ) : (
          iconName && <pixiv-icon name={iconName} scale="1"></pixiv-icon>
          )}
    <Tooltip id="my-tooltip" />
    </button>
  );
};
