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

  buildTree(): ItemNode[] {
    let listNode: ItemNode[] = [];

    for (let i = 0; i < 6; ++i) {
      const layer: ItemNode = {
        item: `Layer ${i}`,
        children: []
      };

      for (let j = 0; j < 2000; ++j) {
        const manager: ItemNode = {
          item: `Manager ${j}`,
          children: [],
          data: {
            managerId: j,
            managerName: `Manager ${j}`,
            managerEmail: `manager${j}@gmail.com`,
            orgId: `OrgId ${j}`,
            orgName: `OrgName ${j}`,
          },
        };

        layer.children.push(manager);
      }

      listNode.push(layer);
    }

    return listNode;
  }
}
