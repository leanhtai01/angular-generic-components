import { Injectable } from '@angular/core';
import { ItemFlatNode, ItemNode } from '../model/generic-tree-node.model';
import { LayerInfo } from '../interface/layer-info.interface';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  toOrgIds(itemFlatNodes: ItemFlatNode[]): string[] {
    return itemFlatNodes.filter(node => node.data).map(node => node.data.orgId);
  }

  buildLayerTree(data: LayerInfo): ItemNode[] {
    const LAYERS: any = {
      layer1: 'Layer 1',
      layer2: 'Layer 2',
      layer3: 'Layer 3',
      layer4: 'Layer 4',
      layer5: 'Layer 5',
      layer6: 'Layer 6',
      layer7: 'Layer 7',
    };

    const listNode: ItemNode[] = [];

    Object.entries(data).forEach(([key, managers]) => {
      const layer: ItemNode = {
        item: LAYERS[key],
        children: [],
      };

      managers.forEach(
        (managerInfo: {
          managerName: any;
          managerId: any;
          managerEmail: any;
          orgId: any;
          orgName: any;
          orgLevel: any;
        }) => {
          const manager: ItemNode = {
            item: managerInfo.managerName,
            children: [],
            data: {
              managerId: managerInfo.managerId,
              managerName: managerInfo.managerName,
              managerEmail: managerInfo.managerEmail,
              orgId: managerInfo.orgId,
              orgName: managerInfo.orgName,
              orgLevel: managerInfo.orgLevel
            },
          };

          layer.children.push(manager);
        }
      );

      listNode.push(layer);
    });

    return listNode;
  }
}
