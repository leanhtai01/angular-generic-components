import { Component } from '@angular/core';
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {SelectionModel} from "@angular/cdk/collections";

export interface LayerManagerInfo {
  managerId: number;
  managerName: string;
  managerEmail: string;
  orgId: string;
  orgName: string;
}

export interface LayerManagerInfoDto {
  layer1Managers: LayerManagerInfo[];
  layer2Managers: LayerManagerInfo[];
  layer3Managers: LayerManagerInfo[];
  layer4Managers: LayerManagerInfo[];
  layer5Managers: LayerManagerInfo[];
  layer6Managers: LayerManagerInfo[];
  layer7Managers: LayerManagerInfo[];
}

const DATA: LayerManagerInfoDto = {
  layer1Managers: [
    {
      managerId: 11581385,
      managerName: 'Salvino, Mike Joseph',
      managerEmail: 'mike.salvino@dxc.com',
      orgId: '65000001',
      orgName: 'DXC Technology',
    },
  ],
  layer2Managers: [
    {
      managerId: 583173,
      managerName: 'Sharp, Ken P',
      managerEmail: 'ken.sharp@dxc.com',
      orgId: '65000026',
      orgName: 'Corp Fn - Finance',
    },
    {
      managerId: 655831,
      managerName: 'Deckelman Jr., William Leroy',
      managerEmail: 'bill.deckelman@dxc.com',
      orgId: '65000027',
      orgName: 'Corp Fn - Legal',
    },
  ],
  layer3Managers: [
    {
      managerId: 9015882,
      managerName: 'Copley, Natasha',
      managerEmail: 'ncopley@dxc.com',
      orgId: '65017700',
      orgName: 'Chief of Staff – APAC',
    },
    {
      managerId: 11571318,
      managerName: 'Owens, Jimmie',
      managerEmail: 'Jimmie.owens@dxc.com',
      orgId: '65000186',
      orgName: 'Global Cyber Security',
    },
  ],
  layer4Managers: [
    {
      managerId: 11744547,
      managerName: 'Gilmore, Lou Anne',
      managerEmail: 'louanne.gilmore@dxc.com',
      orgId: '65018128',
      orgName: 'Global Delivery Assurance',
    },
    {
      managerId: 11590932,
      managerName: 'Wentink, Robbert',
      managerEmail: 'robbert.wentink@dxc.com',
      orgId: '65017460',
      orgName: 'Nordics',
    },
  ],
  layer5Managers: [
    {
      managerId: 20408890,
      managerName: 'Kochan, Kamilia',
      managerEmail: 'kamilia.chouchane@dxc.com',
      orgId: '65018438',
      orgName: 'BPS Poland GD- Operations',
    },
    {
      managerId: 11735404,
      managerName: 'Pasternak, Sean B.',
      managerEmail: 'sean.pasternak@dxc.com',
      orgId: '65016596',
      orgName: 'External Communications, PR',
    },
  ],
  layer6Managers: [
    {
      managerId: 11721271,
      managerName: 'Ralph, Glen Dale',
      managerEmail: 'glen.ralph@dxc.com',
      orgId: '65015082',
      orgName: 'Cloud Delivery Advisory',
    },
    {
      managerId: 11755883,
      managerName: 'Yaman, Mehmet',
      managerEmail: 'mehmet.yaman@dxc.com',
      orgId: '65017872',
      orgName: 'ES CA BC Public Sector - Advanced Solutions',
    },
  ],
  layer7Managers: [
    {
      managerId: 75006424,
      managerName: 'Ølholm, Arnita',
      managerEmail: 'arnita.oelholm@dxc.com',
      orgId: '65018034',
      orgName: 'Regional Payroll',
    },
    {
      managerId: 11598689,
      managerName: 'Guevarra, Renalett',
      managerEmail: 'renalett.guevarra@dxc.com',
      orgId: '65015487',
      orgName: 'Cloud Infra / ITO PH - AMS/EU - Batch Shared 2',
    },
  ],
};

/**
 * Node for item
 */
export class ItemNode {
  constructor(public item: string, public children: ItemNode[], public data?: any) {}
}

/**
 * Flat item node with expandable and level information
 */
export class ItemFlatNode {
  constructor(
    public item: string,
    public level: number,
    public expandable: boolean,
    public data?: any
  ) {}
}

const LAYERS: any = {
  'layer1Managers': 'Layer 1',
  'layer2Managers': 'Layer 2',
  'layer3Managers': 'Layer 3',
  'layer4Managers': 'Layer 4',
  'layer5Managers': 'Layer 5',
  'layer6Managers': 'Layer 6',
  'layer7Managers': 'Layer 7'
};

function buildTree(): ItemNode[] {
  let listNode: ItemNode[] = [];

  Object.entries(DATA).forEach(([key, managers]) => {
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
          },
        };

        layer.children.push(manager);
      }
    );

    listNode.push(layer);
  });

  return listNode;
}

@Component({
  selector: 'efp-mat-tree-with-checkboxes',
  templateUrl: './mat-tree-with-checkboxes.component.html',
  styleUrls: ['./mat-tree-with-checkboxes.component.scss'],
})
export class MatTreeWithCheckboxesComponent {
  /** Map from flat node to nested node. This helps us find the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

  treeControl: FlatTreeControl<ItemFlatNode>;

  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(
    true /* multiple */
  );

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<ItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  ngOnInit(): void {
    this.dataSource.data = buildTree();
  }

  getLevel = (node: ItemFlatNode) => node.level;

  isExpandable = (node: ItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new ItemFlatNode('', 0, false);
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.data = node.data;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child))
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    if (this.checklistSelection.isSelected(node)) {
      this.checklistSelection.select(...descendants);
    } else {
      this.checklistSelection.deselect(...descendants);
    }

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    console.log(this.checklistSelection.selected);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    console.log(this.checklistSelection.selected);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ItemFlatNode): void {
    let parent: ItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: ItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: ItemFlatNode): ItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
}
