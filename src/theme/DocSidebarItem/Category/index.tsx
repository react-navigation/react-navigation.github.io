import Category from '@theme-original/DocSidebarItem/Category';
import { icons } from './icons';

function svgToDataUri(svg: string) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, "'");

  return `url("data:image/svg+xml,${encoded}")`;
}

export default function CategoryWrapper(
  props: React.ComponentProps<typeof Category>
) {
  const iconName = props.item.customProps?.icon as
    | keyof typeof icons
    | undefined;
  const svg = iconName ? icons[iconName] : null;

  if (!svg) {
    return <Category {...props} />;
  }

  return (
    <Category
      {...props}
      data-category-icon
      style={{ '--category-icon': svgToDataUri(svg) } as React.CSSProperties}
    />
  );
}
