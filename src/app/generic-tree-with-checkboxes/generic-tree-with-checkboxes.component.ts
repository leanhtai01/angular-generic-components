import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { ItemFlatNode, ItemNode } from '../model/generic-tree-node.model';

@Component({
  selector: 'efp-generic-tree-with-checkboxes',
  templateUrl: './generic-tree-with-checkboxes.component.html',
  styleUrls: ['./generic-tree-with-checkboxes.component.scss'],
})
export class GenericTreeWithCheckboxesComponent implements OnInit, OnChanges {
  @Input() treeDataSource: ItemNode[] = [];
  @Input() searchPlaceholder: string = 'Keyword';
  @Output() onSelectionChanged = new EventEmitter<ItemFlatNode[]>();

  @ViewChild('searchBox') searchBox: any;

  /** Map from flat node to nested node. This helps us find the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

  treeControl: FlatTreeControl<ItemFlatNode>;

  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
  cacheData: ItemNode[] = [];

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);

  isNoResult: boolean = false;

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

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.data = changes['treeDataSource'].currentValue;
    this.cacheData = changes['treeDataSource'].currentValue;
  }

  ngOnInit(): void {
    this.dataSource.data = this.treeDataSource;
    this.cacheData = this.treeDataSource;
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

  /** Toggle the item selection. Select/deselect all the descendants node */
  itemSelectionToggle(node: ItemFlatNode): void {
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

    // inform parent for selection changes
    this.onSelectionChanged.emit(this.checklistSelection.selected);
  }

  /** Toggle a leaf item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    // inform parent for selection changes
    this.onSelectionChanged.emit(this.checklistSelection.selected);
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

  getSearchMatchesCount(keyword: string): number {
    let count = 0;

    for (const [value] of this.flatNodeMap.entries()) {
      if (value.item.toLowerCase().includes(keyword.toLowerCase())) {
        count++;
      }
    }

    return count;
  }

  search(keyboardEvent: KeyboardEvent): void {
    const keyword: string = (keyboardEvent.target as HTMLInputElement).value;
    let data = structuredClone(this.cacheData);

    if (keyword) {
      data = data.filter(
        (root: any) =>
          this.compareIgnoreCase(root.item, keyword) ||
          root.children.some((child: any) =>
            this.compareIgnoreCase(child.item, keyword)
          )
      );

      for (let root of data) {
        let matchedChildren: ItemNode[] = [];

        for (let child of root.children) {
          if (this.compareIgnoreCase(child.item, keyword)) {
            matchedChildren.push(child);
          }
        }

        root.children = matchedChildren;
      }

      this.dataSource.data = data;
      this.treeControl.expandAll();
    } else {
      this.dataSource.data = this.cacheData;
      this.treeControl.collapseAll();
    }
  }

  compareIgnoreCase(s1: string, s2: string) {
    return s1.toLocaleLowerCase().indexOf(s2.toLocaleLowerCase()) !== -1;
  }

  selectAll() {
    this.dataSource.data = this.cacheData;

    const firstLevelNodes = this.treeControl.dataNodes.filter(
      (node: ItemFlatNode) => node.level === 0
    );

    firstLevelNodes.forEach((node) => {
      this.checklistSelection.select(node);
      this.treeControl.getDescendants(node).forEach((descendant) => {
        this.checklistSelection.select(descendant);
      });
    });

    this.treeControl.collapseAll();
    this.clearSearchBox();
    this.onSelectionChanged.emit(this.checklistSelection.selected);
  }

  clearAll() {
    this.dataSource.data = this.cacheData;

    const firstLevelNodes = this.treeControl.dataNodes.filter(
      (node: ItemFlatNode) => node.level === 0
    );

    firstLevelNodes.forEach((node) => {
      this.checklistSelection.deselect(node);
      this.treeControl.getDescendants(node).forEach((descendant) => {
        this.checklistSelection.deselect(descendant);
      });
    });

    this.treeControl.collapseAll();
    this.clearSearchBox();
    this.onSelectionChanged.emit(this.checklistSelection.selected);
  }

  clearSearchBox() {
    this.searchBox.nativeElement.value = '';
  }
}
