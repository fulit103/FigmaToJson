import { buildOriginalLayerTree } from "./figmaNode/buildOriginalLayerTree";
import { buildTagTree } from "./figmaNode/buildTagTree";
import { removeUnnecessaryPropsFromTagTree } from "./figmaNode/removeUnnecessaryPropsFromTagTree";

figma.showUI(__html__, {
  height: 1000,  // Height of the UI in pixels
  width: 500,
});

function sendSelection() {
  console.log('selectionchange', figma.currentPage.selection);

  if (figma.currentPage.selection.length === 0) {
    figma.ui.postMessage({
      type: "empty",
    });
    return;
  }

  figma.ui.postMessage({
    type: 'code',
    selection: figma.currentPage.selection.map(element => element.name)
  })
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-rectangles',
      message: `Created ${msg.count} Rectangles`,
    });
  }

  if(msg.type == 'create-json') {
    try {
      const selectedNode = figma.currentPage.selection[0]
      const usedComponentNodes: ComponentNode[] = [];

      const thisTagTree = buildTagTree(selectedNode, usedComponentNodes);

      const originalNodeTree = buildOriginalLayerTree(selectedNode);    

      if (!thisTagTree) {
        figma.notify('No visible nodes found');
        figma.closePlugin();
        return;
      }

      const nodeJSON = removeUnnecessaryPropsFromTagTree(thisTagTree);

      console.log(nodeJSON);

      figma.ui.postMessage({
        type: 'node-json',
        message: nodeJSON,
      });
    } catch (e) {
      console.log("Error", e )
    }

  }

  //console.log('message', msg);

  //figma.closePlugin();
};

figma.on("selectionchange", () => {
  sendSelection();
});

sendSelection();

