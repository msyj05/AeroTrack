interface Props {
  className?: string;
}

/** AeroTrack drone mark. Drop the image at public/drone-mark.png */
export default function DroneMark({ className = "h-5 w-5" }: Props) {
  return (
    <img
      src="/drone-mark.png"
      alt=""
      className={`${className} object-contain brightness-0 invert`}
      draggable={false}
    />
  );
}
