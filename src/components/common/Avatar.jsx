// src/components/common/Avatar.jsx
import { getInitials } from '../../utils/helpers';
import styles from './Avatar.module.css';

export default function Avatar({ name = '', photo = null, size = 36, bg, color, style = {} }) {
  const initials = getInitials(name);
  const sizeStyle = { width: size, height: size, fontSize: size * 0.3, ...style };

  if (bg) sizeStyle.background = bg;
  if (color) sizeStyle.color = color;

  return (
    <div className={styles.avatar} style={sizeStyle}>
      {photo ? (
        <img src={photo} alt={name} className={styles.img} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
