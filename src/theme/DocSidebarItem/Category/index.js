import Category from '@theme-original/DocSidebarItem/Category';
import { icons } from './icons';

function svgToDataUri(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, "'");

  return `url("data:image/svg+xml,${encoded}")`;
}

export default function CategoryWrapper(props) {
  const iconName = props.item.customProps?.icon;
  const svg = iconName ? icons[iconName] : null;

  if (!svg) {
    return <Category {...props} />;
  }

  return (
    <Category
      {...props}
      data-category-icon
      style={{ '--category-icon': svgToDataUri(svg) }}
    />
  );
}
