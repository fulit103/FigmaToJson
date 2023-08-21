import { CSSData, getCssDataForTag } from './getCssDataForTag';
import { isImageNode } from './isImageNode';
export type UnitType = 'px' | 'rem' | 'remAs10px';

type Component = {
  name: string;
  props: { [property: string]: string | boolean } | null;
  isComponent: true;
  children: Tag[];
};

export type ChunkComponet = {
  nodeId: string;
  isChunk: boolean;
};

export type Tag =
  | {
      id?: string;
      name: string;
      isText?: boolean;
      textCharacters?: string | null;
      isImg?: boolean;
      css: CSSData;
      children: Tag[];
      isComponent?: false;
      tokens?: { [key in string]: string };
    }
  | Component
  | ChunkComponet;

export type ComponentType = {};

export function buildTagTree(
  node: SceneNode,
  componentNodes: ComponentNode[]
): Tag | null {
  if (!node.visible) {
    return null;
  }

  const isImg = isImageNode(node);
  const childTags: Tag[] = [];
  if ('children' in node && !isImg) {
    node.children.forEach((child) => {
      /*if (child.type === 'INSTANCE') {
        const props = Object.keys(child.componentProperties).reduce(
          (_props, key) => {
            const value = child.componentProperties[
              key
            ] as ComponentProperties[string];

            // component property keys are named like this: "color#primary"
            // thus we need to split the key to get the actual property name
            const _key = value.type === 'VARIANT' ? key : key.split('#')[0];
            return { ..._props, [_key]: value.value };
          },
          {} as { [property: string]: string | boolean }
        );

        if ('Instance' in props) {
          console.log('Prop Instance', props)
          delete props['Instance'];
        }
        console.log("IS_COMPONENT:  ", child)
        console.log("IS_COMPONENT TYPE:  ", child.type)                
        childTags.unshift({
          name: child.name.replace(' ', ''),          
          props,
          css: getCssDataForTag(child),
          isComponent: true,
          children: child.children,
        });
        console.log("IS_COMPONENT children", child.children)
        if (child.mainComponent) {
          console.log("IS_COMPONENT mainComponent:  ", child.mainComponent)
          componentNodes.unshift(child.mainComponent);
        }
      } else {*/
        const childTag = buildTagTree(child, componentNodes);
        if (childTag) {
          childTags.unshift(childTag);
        }
      //}
    });
  }

  const tag: Tag = {
    id: node.id,
    name: node.name,
    css: getCssDataForTag(node),
    children: childTags,
  };

  if (node.type === 'TEXT') {
    tag.isText = true;
    tag.textCharacters = node.characters;
  }
  if (isImg) {
    tag.isImg = true;
  }

  return tag;
}
