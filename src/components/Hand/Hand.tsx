import clsx from 'clsx';
import './Hand.scss';

interface Props {
  className?: string;
}

export default function Hand({ className }: Props) {
  return (
    <div className={clsx('hand', className)}>
      <div className="limb fist" />
      <div className="limb finger index" />
      <div className="limb finger middle" />
      <div className="limb finger ring" />
      <div className="limb finger pinky" />
      <div className="limb thumb" />
      <div className="limb arm" />
    </div>
  );
}
